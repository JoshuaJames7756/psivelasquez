import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../_lib/auth.js'
import { sql } from '../_lib/db.js'

/**
 * GET /api/pacientes?q=nombre
 * Solo panel. Dato clínico, nunca accesible sin sesión válida.
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
