import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../_lib/auth.js'
import { sql } from '../_lib/db.js'

const SEMANAS_RIESGO_DEFAULT = 3

/**
 * GET /api/pacientes/en-riesgo?semanas=3
 * Solo panel. Alimenta las tarjetas de "alerta de abandono" en Hoy.
 *
 * Definición de "en riesgo": paciente activo cuya última cita
 * confirmada fue hace más de N semanas, y que NO tiene ningún slot
 * futuro en estado solicitada/confirmada (es decir, no está ya en
 * proceso de volver a agendar).
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

  const semanasParam = Number(req.query.semanas)
  const semanas = Number.isFinite(semanasParam) && semanasParam > 0 ? semanasParam : SEMANAS_RIESGO_DEFAULT

  try {
    const rows = await sql`
      select
        p.id,
        p.nombre,
        p.telefono,
        max(s.fecha) as ultima_cita_confirmada
      from pacientes p
      join slots_sabado s on s.paciente_id = p.id and s.estado = 'confirmada'
      where p.estado = 'activo'
        and not exists (
          select 1 from slots_sabado sf
          where sf.paciente_id = p.id
            and sf.estado in ('solicitada', 'confirmada')
            and sf.fecha >= current_date
        )
      group by p.id, p.nombre, p.telefono
      having max(s.fecha) < current_date - (${semanas}::int * interval '1 week')
      order by max(s.fecha) asc
    `

    return res.status(200).json({ pacientes: rows, semanas })
  } catch (err) {
    console.error('[GET /api/pacientes/en-riesgo]', err)
    return res.status(500).json({ error: 'Error al calcular pacientes en riesgo' })
  }
}
