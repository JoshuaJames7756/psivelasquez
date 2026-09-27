import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../_lib/db.js'

/**
 * GET /api/citas?fecha=YYYY-MM-DD
 * Lectura pública: el sitio la usa para pintar la grilla de "Modalidad y agenda".
 * No expone datos de paciente completos, solo lo necesario para saber
 * qué está disponible.
 *
 * Sin ?fecha, devuelve el próximo sábado con slots.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { fecha } = req.query

  try {
    const rows = fecha
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
