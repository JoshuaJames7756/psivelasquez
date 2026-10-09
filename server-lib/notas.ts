import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from './db.js'

/**
 * Notas rápidas (recurso "notas" de api/tareas.ts). La sesión ya la
 * verificó el handler que llama a esta función.
 *
 * GET    ?recurso=notas                 — las 30 más recientes
 * POST   ?recurso=notas  { texto, pacienteId? }
 * DELETE ?recurso=notas  { id }
 */
export async function manejarNotas(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const notas = await sql`
        select n.id, n.texto, n.paciente_id, n.creado_en, p.nombre as paciente_nombre
        from notas_rapidas n
        left join pacientes p on p.id = n.paciente_id
        order by n.creado_en desc
        limit 30
      `
      return res.status(200).json({ notas })
    } catch (err) {
      console.error('[GET notas]', err)
      return res.status(500).json({ error: 'Error al obtener las notas' })
    }
  }

  if (req.method === 'POST') {
    const { texto, pacienteId } = req.body ?? {}
    if (typeof texto !== 'string' || texto.trim().length === 0 || texto.length > 2000) {
      return res.status(400).json({ error: 'La nota debe tener entre 1 y 2000 caracteres' })
    }
    try {
      const [nota] = await sql`
        insert into notas_rapidas (texto, paciente_id)
        values (${texto.trim()}, ${typeof pacienteId === 'string' ? pacienteId : null})
        returning *
      `
      return res.status(201).json({ nota })
    } catch (err) {
      console.error('[POST notas]', err)
      return res.status(500).json({ error: 'Error al guardar la nota' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body ?? {}
    if (typeof id !== 'string') return res.status(400).json({ error: 'id requerido' })
    try {
      await sql`delete from notas_rapidas where id = ${id}`
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('[DELETE notas]', err)
      return res.status(500).json({ error: 'Error al eliminar la nota' })
    }
  }

  res.setHeader('Allow', 'GET, POST, DELETE')
  return res.status(405).json({ error: 'Método no permitido' })
}
