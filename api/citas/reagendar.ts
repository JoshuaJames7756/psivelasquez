import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../_lib/auth.js'
import { sql } from '../_lib/db.js'

/**
 * PATCH /api/citas/reagendar   body: { slotOrigenId, slotDestinoId }
 * Solo panel. Mueve el paciente (y su modalidad/notas de reserva) del
 * slot de origen al de destino, libera el de origen.
 *
 * Una sola sentencia con CTEs encadenados: el UPDATE que libera el
 * origen solo corre "dentro" de la misma sentencia si el UPDATE del
 * destino de verdad afectó una fila. Esto evita el bug de usar dos
 * UPDATE en una transacción normal, donde un UPDATE que afecta 0
 * filas NO revierte la transacción (no es un error SQL) — eso podría
 * liberar el origen sin haber movido nada al destino, perdiendo la
 * cita. Con CTEs, si "destino" no produce filas, "origen" tampoco
 * corre, porque el segundo CTE selecciona a partir del primero.
 *
 * El historial clínico NO se pierde: vive referenciado por
 * paciente_id en historial_clinico, no depende de qué slot_id tenía
 * la sesión original.
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

  const { slotOrigenId, slotDestinoId } = req.body ?? {}
  if (typeof slotOrigenId !== 'string' || typeof slotDestinoId !== 'string') {
    return res.status(400).json({ error: 'Parámetros inválidos' })
  }
  if (slotOrigenId === slotDestinoId) {
    return res.status(400).json({ error: 'El slot de origen y destino no pueden ser el mismo' })
  }

  try {
    const [origen] = await sql`select * from slots_sabado where id = ${slotOrigenId}`
    if (!origen || !origen.paciente_id) {
      return res.status(404).json({ error: 'El slot de origen no tiene una cita para mover' })
    }

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
        where id = ${slotOrigenId}
          and exists (select 1 from destino)
        returning id
      )
      select
        (select count(*) from destino) as destino_afectado,
        (select count(*) from origen_liberado) as origen_afectado
    `

    const [{ destino_afectado }] = resultado

    if (Number(destino_afectado) === 0) {
      return res.status(409).json({ error: 'El slot de destino no está disponible' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[PATCH /api/citas/reagendar]', err)
    return res.status(500).json({ error: 'Error al reagendar la cita' })
  }
}
