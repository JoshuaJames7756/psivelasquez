import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../../server-lib/auth.js'
import { sql } from '../../server-lib/db.js'

const SEMANAS_RIESGO_DEFAULT = 3

/**
 * GET /api/pacientes?q=nombre           — búsqueda por nombre
 * GET /api/pacientes?en_riesgo=1        — alertas de abandono (Hoy)
 *
 * Solo panel. Dato clínico, nunca accesible sin sesión válida.
 * Fusionado desde pacientes/index.ts + pacientes/en-riesgo.ts para
 * bajar el conteo de funciones serverless (límite de 12 en Vercel
 * Hobby).
 *
 * Definición de "en riesgo": paciente activo cuya última cita
 * confirmada fue hace más de N semanas, y que NO tiene ningún slot
 * futuro en estado solicitada/confirmada.
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

  if (req.query.en_riesgo === '1') {
    const semanasParam = Number(req.query.semanas)
    const semanas =
      Number.isFinite(semanasParam) && semanasParam > 0 ? semanasParam : SEMANAS_RIESGO_DEFAULT

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
      console.error('[GET /api/pacientes?en_riesgo=1]', err)
      return res.status(500).json({ error: 'Error al calcular pacientes en riesgo' })
    }
  }

  const { q } = req.query
  const termino = typeof q === 'string' ? q.trim() : ''

  try {
    const rows = termino
      ? await sql`
          select id, nombre, edad, estado, primera_vez, actualizado_en
          from pacientes
          where lower(nombre) like lower(${'%' + termino + '%'})
          order by nombre asc
          limit 20
        `
      : await sql`
          select id, nombre, edad, estado, primera_vez, actualizado_en
          from pacientes
          order by actualizado_en desc
          limit 20
        `

    return res.status(200).json({ pacientes: rows })
  } catch (err) {
    console.error('[GET /api/pacientes]', err)
    return res.status(500).json({ error: 'Error al buscar pacientes' })
  }
}
