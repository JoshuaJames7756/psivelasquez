import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../_lib/auth.js'
import { sql, vencerSlotsExpirados } from '../_lib/db.js'

/**
 * GET /api/citas/panel?fecha=YYYY-MM-DD
 * Solo panel — a diferencia de GET /api/citas (público, sin datos de
 * paciente), esta incluye nombre y teléfono del paciente asociado.
 * Nunca exponer esto sin sesión válida.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const sesion = await verificarSesion(req)
  if (!sesion) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  const { fecha } = req.query

  try {
    await vencerSlotsExpirados()

    const rows = fecha
      ? await sql`
          select s.id, s.fecha, s.hora_inicio, s.modalidad, s.estado,
                 s.paciente_id, p.nombre as paciente_nombre, p.telefono as paciente_telefono
          from slots_sabado s
          left join pacientes p on p.id = s.paciente_id
          where s.fecha = ${fecha as string}
          order by s.hora_inicio asc
        `
      : await sql`
          select s.id, s.fecha, s.hora_inicio, s.modalidad, s.estado,
                 s.paciente_id, p.nombre as paciente_nombre, p.telefono as paciente_telefono
          from slots_sabado s
          left join pacientes p on p.id = s.paciente_id
          where s.fecha >= current_date
          order by s.fecha asc, s.hora_inicio asc
          limit 8
        `

    return res.status(200).json({ slots: rows })
  } catch (err) {
    console.error('[GET /api/citas/panel]', err)
    return res.status(500).json({ error: 'Error al obtener la agenda' })
  }
}
