import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../_lib/auth.js'
import { sql } from '../_lib/db.js'

type AccionCita = 'confirmar' | 'liberar'

function esAccionValida(valor: unknown): valor is AccionCita {
  return valor === 'confirmar' || valor === 'liberar'
}

/**
 * PATCH /api/citas/:id   body: { accion: 'confirmar' | 'liberar' }
 * Solo panel — requiere sesión de Rebeca (o Joshua, cuenta de soporte).
 *
 * confirmar: Rebeca recibió el comprobante de pago por WhatsApp y marca
 *            la cita como pagada/confirmada.
 * liberar:   el slot vuelve a "disponible", sin paciente asociado,
 *            manual o por vencimiento de la ventana de 24-48h.
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
  const { accion } = req.body ?? {}

  if (typeof id !== 'string' || !esAccionValida(accion)) {
    return res.status(400).json({ error: 'Parámetros inválidos' })
  }

  try {
    const [slotActualizado] =
      accion === 'confirmar'
        ? await sql`
            update slots_sabado
            set estado = 'confirmada', confirmado_en = now()
            where id = ${id} and estado = 'solicitada'
            returning id, estado, confirmado_en
          `
        : await sql`
            update slots_sabado
            set estado = 'disponible',
                paciente_id = null,
                modalidad = null,
                notas_reserva = null,
                solicitado_en = null,
                expira_en = null,
                confirmado_en = null
            where id = ${id} and estado in ('solicitada', 'confirmada')
            returning id, estado
          `

    if (!slotActualizado) {
      return res.status(409).json({ error: 'El cupo no está en un estado válido para esa acción' })
    }

    return res.status(200).json({ slot: slotActualizado })
  } catch (err) {
    console.error('[PATCH /api/citas/:id]', err)
    return res.status(500).json({ error: 'Error al actualizar el cupo' })
  }
}
