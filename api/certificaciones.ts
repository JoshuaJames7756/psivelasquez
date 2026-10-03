import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../server-lib/auth.js'
import { sql } from '../server-lib/db.js'

/**
 * GET /api/certificaciones     — público, el sitio las muestra en /formacion
 * POST /api/certificaciones    — solo panel, crea una nueva
 * PATCH /api/certificaciones   body: { id, ... }  — solo panel, edita
 * DELETE /api/certificaciones  body: { id }        — solo panel, elimina
 *
 * CRUD completo en un solo archivo para no sumar funciones serverless
 * al límite de 12 del plan Hobby de Vercel (ver README).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const certificaciones = await sql`
        select * from certificaciones order by orden asc, anio desc nulls last
      `
      return res.status(200).json({ certificaciones })
    } catch (err) {
      console.error('[GET /api/certificaciones]', err)
      return res.status(500).json({ error: 'Error al obtener las certificaciones' })
    }
  }

  // Todo lo demás (crear/editar/borrar) requiere sesión del panel.
  const sesion = await verificarSesion(req)
  if (!sesion) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  if (req.method === 'POST') {
    const { institucion, nombre, anio, categoria, descripcion, documentoUrl, orden } =
      req.body ?? {}
    if (typeof institucion !== 'string' || typeof nombre !== 'string') {
      return res.status(400).json({ error: 'institucion y nombre son requeridos' })
    }

    try {
      const [certificacion] = await sql`
        insert into certificaciones (institucion, nombre, anio, categoria, descripcion, documento_url, orden)
        values (
          ${institucion}, ${nombre}, ${anio ?? null}, ${categoria ?? null},
          ${descripcion ?? null}, ${documentoUrl ?? null}, ${orden ?? 0}
        )
        returning *
      `
      return res.status(201).json({ certificacion })
    } catch (err) {
      console.error('[POST /api/certificaciones]', err)
      return res.status(500).json({ error: 'Error al crear la certificación' })
    }
  }

  if (req.method === 'PATCH') {
    const { id, institucion, nombre, anio, categoria, descripcion, documentoUrl, orden } =
      req.body ?? {}
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'id requerido' })
    }

    // undefined -> null explícito antes de interpolar (mismo patrón
    // que api/historial/[id].ts y api/tareas.ts — no confiar en cómo
    // el driver serializaría undefined en un parámetro).
    const institucionNorm = institucion ?? null
    const nombreNorm = nombre ?? null
    const anioNorm = anio ?? null
    const categoriaNorm = categoria ?? null
    const descripcionNorm = descripcion ?? null
    const documentoUrlNorm = documentoUrl ?? null
    const ordenNorm = orden ?? null

    try {
      const [certificacion] = await sql`
        update certificaciones
        set institucion = coalesce(${institucionNorm}, institucion),
            nombre = coalesce(${nombreNorm}, nombre),
            anio = coalesce(${anioNorm}, anio),
            categoria = coalesce(${categoriaNorm}, categoria),
            descripcion = coalesce(${descripcionNorm}, descripcion),
            documento_url = coalesce(${documentoUrlNorm}, documento_url),
            orden = coalesce(${ordenNorm}, orden)
        where id = ${id}
        returning *
      `
      if (!certificacion) {
        return res.status(404).json({ error: 'Certificación no encontrada' })
      }
      return res.status(200).json({ certificacion })
    } catch (err) {
      console.error('[PATCH /api/certificaciones]', err)
      return res.status(500).json({ error: 'Error al actualizar la certificación' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body ?? {}
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'id requerido' })
    }

    try {
      const [eliminada] = await sql`delete from certificaciones where id = ${id} returning id`
      if (!eliminada) {
        return res.status(404).json({ error: 'Certificación no encontrada' })
      }
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('[DELETE /api/certificaciones]', err)
      return res.status(500).json({ error: 'Error al eliminar la certificación' })
    }
  }

  res.setHeader('Allow', 'GET, POST, PATCH, DELETE')
  return res.status(405).json({ error: 'Método no permitido' })
}
