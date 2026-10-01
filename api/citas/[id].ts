import type { VercelRequest, VercelResponse } from '@vercel/node'
import { registrarAuditoria } from '../_lib/auditoria.js'
import { verificarSesion } from '../_lib/auth.js'
import { sql } from '../_lib/db.js'

type AccionCita = 'confirmar' | 'pagar' | 'completar' | 'cancelar' | 'liberar' | 'reagendar'

function esAccionValida(valor: unknown): valor is AccionCita {
  return (
    valor === 'confirmar' ||
    valor === 'pagar' ||
    valor === 'completar' ||
    valor === 'cancelar' ||
    valor === 'liberar' ||
    valor === 'reagendar'
  )
}

/**
 * PATCH /api/citas/:id
 *   body: { accion: 'confirmar' | 'pagar' | 'completar' | 'cancelar' | 'liberar' }
 *   body: { accion: 'reagendar', slotDestinoId }  — :id es el slot ORIGEN
 *
 * Solo panel — requiere sesión de Rebeca (o Joshua, cuenta de soporte).
 * Fusiona citas/[id].ts + citas/reagendar.ts para bajar el conteo de
 * funciones serverless (límite de 12 en el plan Hobby de Vercel).
 *
 * Flujo secuencial confirmado (Prompt 2.0, sección 55):
 *   solicitada -> confirmada -> pagada -> completada
 * cancelada y liberada son salidas alternativas, no parte de la
 * secuencia principal.
 *
 * confirmar:  Rebeca separó el horario (sin pago todavía).
 * pagar:      llegó el comprobante del 50% por WhatsApp.
 * completar:  la sesión efectivamente ocurrió.
 * cancelar:   el paciente avisó que no viene (tuvo intención, avisó
 *             — distinto de liberar, que es por falta de pago/vencimiento).
 * liberar:    el slot vuelve a "disponible", sin paciente asociado.
 * reagendar:  mueve la cita del slot :id (origen) al slotDestinoId,
 *             libera el origen. Ver el comentario sobre CTEs más abajo
 *             para por qué esto NO es un simple par de UPDATE.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH')
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const sesion = await verificarSesion(req)
  if (!sesion) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  const { id } = req.query
  const { accion, slotDestinoId } = req.body ?? {}

  if (typeof id !== 'string' || !esAccionValida(accion)) {
    return res.status(400).json({ error: 'Parámetros inválidos' })
  }

  try {
    if (accion === 'reagendar') {
      if (typeof slotDestinoId !== 'string') {
        return res.status(400).json({ error: 'slotDestinoId requerido' })
      }
      if (id === slotDestinoId) {
        return res.status(400).json({ error: 'El slot de origen y destino no pueden ser el mismo' })
      }

      const [origen] = await sql`select * from slots_sabado where id = ${id}`
      if (!origen || !origen.paciente_id) {
        return res.status(404).json({ error: 'El slot de origen no tiene una cita para mover' })
      }

      // Una sola sentencia con CTEs encadenados: el UPDATE que libera
      // el origen solo corre "dentro" de la misma sentencia si el
      // UPDATE del destino de verdad afectó una fila. Esto evita el
      // bug de usar dos UPDATE en una transacción normal, donde un
      // UPDATE que afecta 0 filas NO revierte la transacción (no es
      // un error SQL) — eso podría liberar el origen sin haber
      // movido nada al destino, perdiendo la cita.
      const resultado = await sql`
        with destino as (
          update slots_sabado
          set estado = ${origen.estado},
              paciente_id = ${origen.paciente_id},
              modalidad = ${origen.modalidad},
              notas_reserva = ${origen.notas_reserva},
              solicitado_en = ${origen.solicitado_en},
              expira_en = ${origen.expira_en},
              confirmado_en = ${origen.confirmado_en}
          where id = ${slotDestinoId} and estado = 'disponible'
          returning id
        ),
        origen_liberado as (
          update slots_sabado
          set estado = 'disponible',
              paciente_id = null,
              modalidad = null,
              notas_reserva = null,
              solicitado_en = null,
              expira_en = null,
              confirmado_en = null
          where id = ${id}
            and exists (select 1 from destino)
          returning id
        )
        select (select count(*) from destino) as destino_afectado
      `

      if (Number(resultado[0].destino_afectado) === 0) {
        return res.status(409).json({ error: 'El slot de destino no está disponible' })
      }

      registrarAuditoria({
        usuarioId: sesion.userId,
        tipoEvento: 'cambio_estado_cita',
        detalle: `reagendó slot ${id} → ${slotDestinoId}`,
      })

      return res.status(200).json({ ok: true })
    }

    let slotActualizado: Record<string, unknown> | undefined

    if (accion === 'confirmar') {
      ;[slotActualizado] = await sql`
        update slots_sabado
        set estado = 'confirmada', confirmado_en = now()
        where id = ${id} and estado = 'solicitada'
        returning id, estado
      `
    } else if (accion === 'pagar') {
      ;[slotActualizado] = await sql`
        update slots_sabado
        set estado = 'pagada'
        where id = ${id} and estado = 'confirmada'
        returning id, estado
      `
    } else if (accion === 'completar') {
      ;[slotActualizado] = await sql`
        update slots_sabado
        set estado = 'completada'
        where id = ${id} and estado = 'pagada'
        returning id, estado
      `
    } else if (accion === 'cancelar') {
      // Cancelada es un estado final informativo — a diferencia de
      // liberar, NO limpia paciente_id, porque conviene saber quién
      // canceló para seguimiento (contactar, reprogramar). El slot
      // en sí no vuelve a estar disponible automáticamente: Rebeca
      // decide si lo libera después con la acción 'liberar'.
      ;[slotActualizado] = await sql`
        update slots_sabado
        set estado = 'cancelada'
        where id = ${id} and estado in ('solicitada', 'confirmada', 'pagada')
        returning id, estado
      `
    } else {
      // accion === 'liberar'
      ;[slotActualizado] = await sql`
        update slots_sabado
        set estado = 'disponible',
            paciente_id = null,
            modalidad = null,
            notas_reserva = null,
            solicitado_en = null,
            expira_en = null,
            confirmado_en = null
        where id = ${id} and estado in ('solicitada', 'confirmada', 'pagada', 'cancelada')
        returning id, estado
      `
    }

    if (!slotActualizado) {
      return res.status(409).json({ error: 'El cupo no está en un estado válido para esa acción' })
    }

    registrarAuditoria({
      usuarioId: sesion.userId,
      tipoEvento: 'cambio_estado_cita',
      detalle: `${accion} slot ${id}`,
    })

    return res.status(200).json({ slot: slotActualizado })
  } catch (err) {
    console.error('[PATCH /api/citas/:id]', err)
    return res.status(500).json({ error: 'Error al actualizar el cupo' })
  }
}
