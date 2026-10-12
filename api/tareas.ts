import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../server-lib/auth.js'
import { sql } from '../server-lib/db.js'
import { manejarNotas } from '../server-lib/notas.js'
import { esFecha, esUuid, textoOpcionalValido } from '../server-lib/validar.js'

const ESTADOS = ['todo', 'en_progreso', 'hecha', 'cancelada']
const PRIORIDADES = ['baja', 'media', 'alta']

/**
 * GET /api/tareas?estado=todo       — listar, filtro opcional por estado
 * POST /api/tareas                  body: { titulo, descripcion?, prioridad?, fechaLimite?, pacienteId? }
 * PATCH /api/tareas  body: { id, estado? , titulo?, descripcion?, prioridad?, fechaLimite? }
 * DELETE /api/tareas body: { id }
 *
 * Solo panel. CRUD completo en un solo archivo (no uno por método)
 * para mantenerse dentro del límite de 12 funciones serverless del
 * plan Hobby de Vercel — ver README, sección "Límite de funciones".
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sesion = await verificarSesion(req)
  if (!sesion) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  // Notas rápidas comparten esta función (límite de 12 en Vercel Hobby).
  if (req.query.recurso === 'notas') return manejarNotas(req, res)

  if (req.method === 'GET') {
    const { estado } = req.query
    try {
      const rows =
        typeof estado === 'string' && ESTADOS.includes(estado)
          ? await sql`
              select * from tareas where estado = ${estado}
              order by fecha_limite asc nulls last, creado_en desc
            `
          : await sql`
              select * from tareas where estado != 'cancelada'
              order by fecha_limite asc nulls last, creado_en desc
            `
      return res.status(200).json({ tareas: rows })
    } catch (err) {
      console.error('[GET /api/tareas]', err)
      return res.status(500).json({ error: 'Error al obtener las tareas' })
    }
  }

  if (req.method === 'POST') {
    const { titulo, descripcion, prioridad, fechaLimite, pacienteId } = req.body ?? {}
    if (typeof titulo !== 'string' || titulo.trim().length === 0 || titulo.length > 200) {
      return res.status(400).json({ error: 'El título es requerido (máx. 200 caracteres)' })
    }
    if (
      !textoOpcionalValido(descripcion, 2000) ||
      (prioridad !== undefined && !PRIORIDADES.includes(prioridad)) ||
      (fechaLimite != null && !esFecha(fechaLimite)) ||
      (pacienteId != null && !esUuid(pacienteId))
    ) {
      return res.status(400).json({ error: 'Datos de tarea inválidos' })
    }

    try {
      const [tarea] = await sql`
        insert into tareas (titulo, descripcion, prioridad, fecha_limite, paciente_id)
        values (
          ${titulo.trim()},
          ${descripcion ?? null},
          ${prioridad ?? 'media'},
          ${fechaLimite ?? null},
          ${pacienteId ?? null}
        )
        returning *
      `
      return res.status(201).json({ tarea })
    } catch (err) {
      console.error('[POST /api/tareas]', err)
      return res.status(500).json({ error: 'Error al crear la tarea' })
    }
  }

  if (req.method === 'PATCH') {
    const { id, estado, titulo, descripcion, prioridad, fechaLimite } = req.body ?? {}
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'id requerido' })
    }

    // undefined -> null explícito: no dependemos de cómo el driver
    // serializaría "undefined" en un parámetro interpolado (no está
    // documentado); NULL sí tiene semántica SQL estándar con COALESCE.
    // Mismo patrón que api/historial/[id].ts.
    const tituloNorm = titulo ?? null
    const descripcionNorm = descripcion ?? null
    const prioridadNorm = prioridad ?? null
    const fechaLimiteNorm = fechaLimite ?? null
    const estadoNorm = estado ?? null

    try {
      const [tarea] = await sql`
        update tareas
        set estado = coalesce(${estadoNorm}, estado),
            titulo = coalesce(${tituloNorm}, titulo),
            descripcion = coalesce(${descripcionNorm}, descripcion),
            prioridad = coalesce(${prioridadNorm}, prioridad),
            fecha_limite = coalesce(${fechaLimiteNorm}, fecha_limite)
        where id = ${id}
        returning *
      `
      if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' })
      }
      return res.status(200).json({ tarea })
    } catch (err) {
      console.error('[PATCH /api/tareas]', err)
      return res.status(500).json({ error: 'Error al actualizar la tarea' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body ?? {}
    if (!esUuid(id)) {
      return res.status(400).json({ error: 'id requerido' })
    }

    try {
      const [eliminada] = await sql`delete from tareas where id = ${id} returning id`
      if (!eliminada) {
        return res.status(404).json({ error: 'Tarea no encontrada' })
      }
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('[DELETE /api/tareas]', err)
      return res.status(500).json({ error: 'Error al eliminar la tarea' })
    }
  }

  res.setHeader('Allow', 'GET, POST, PATCH, DELETE')
  return res.status(405).json({ error: 'Método no permitido' })
}
