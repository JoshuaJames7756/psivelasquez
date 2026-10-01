import type { VercelRequest, VercelResponse } from '@vercel/node'
import { registrarAuditoria } from '../_lib/auditoria.js'
import { verificarSesion } from '../_lib/auth.js'
import { sql } from '../_lib/db.js'

/**
 * GET /api/pacientes/:id
 * Ficha completa del paciente: datos base + historial clínico + escalas
 * + documentos. Solo panel, dato clínico sensible.
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

  const { id } = req.query
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' })
  }

  try {
    const [paciente] = await sql`select * from pacientes where id = ${id}`
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' })
    }

    const [historial, escalas, documentos] = await Promise.all([
      sql`
        select h.*, coalesce(
          json_agg(json_build_object('id', t.id, 'nombre', t.nombre, 'color', t.color))
          filter (where t.id is not null), '[]'
        ) as tags
        from historial_clinico h
        left join historial_tag ht on ht.historial_id = h.id
        left join tag_clinico t on t.id = ht.tag_id
        where h.paciente_id = ${id}
        group by h.id
        order by h.creado_en desc
      `,
      sql`
        select * from escalas_seguimiento
        where paciente_id = ${id}
        order by aplicada_en asc
      `,
      sql`
        select * from documentos_paciente
        where paciente_id = ${id}
        order by subido_en desc
      `,
    ])

    // No se espera (await) para no demorar la respuesta al usuario
    // por un log de auditoría — ver registrarAuditoria() para el
    // manejo de errores silencioso.
    registrarAuditoria({
      usuarioId: sesion.userId,
      tipoEvento: 'acceso_historial',
      pacienteId: id,
    })

    return res.status(200).json({ paciente, historial, escalas, documentos })
  } catch (err) {
    console.error('[GET /api/pacientes/:id]', err)
    return res.status(500).json({ error: 'Error al obtener la ficha del paciente' })
  }
}
