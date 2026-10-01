import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../_lib/auth.js'
import { sql, vencerSlotsExpirados } from '../_lib/db.js'

/**
 * GET /api/citas?fecha=YYYY-MM-DD           — público, sin datos de paciente
 * GET /api/citas?panel=1&fecha=YYYY-MM-DD   — solo panel, requiere sesión,
 *                                              incluye nombre/teléfono
 *
 * Fusionado desde citas/index.ts + citas/panel.ts para bajar el conteo
 * de funciones serverless (límite de 12 en el plan Hobby de Vercel —
 * ver nota en README). La seguridad real no depende de la URL: la
 * rama `panel` exige verificarSesion() ANTES de tocar la query con
 * el join a pacientes, así que pedir ?panel=1 sin sesión sigue
 * devolviendo 401, nunca datos de paciente.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { fecha, panel } = req.query
  const esVistaPanel = panel === '1'

  if (esVistaPanel) {
    const sesion = await verificarSesion(req)
    if (!sesion) {
      return res.status(401).json({ error: 'No autenticado' })
    }
  }

  try {
    await vencerSlotsExpirados()

    const rows = esVistaPanel
      ? fecha
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
      : fecha
        ? await sql`
            select id, fecha, hora_inicio, modalidad, estado
            from slots_sabado
            where fecha = ${fecha as string}
            order by hora_inicio asc
          `
        : await sql`
            select id, fecha, hora_inicio, modalidad, estado
            from slots_sabado
            where fecha >= current_date
            order by fecha asc, hora_inicio asc
            limit 8
          `

    return res.status(200).json({ slots: rows })
  } catch (err) {
    console.error('[GET /api/citas]', err)
    return res.status(500).json({ error: 'Error al obtener los cupos' })
  }
}
