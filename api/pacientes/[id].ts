import type { VercelRequest, VercelResponse } from '@vercel/node'
import { registrarAuditoria } from '../../server-lib/auditoria.js'
import { verificarSesion } from '../../server-lib/auth.js'
import { sql } from '../../server-lib/db.js'

/**
 * GET /api/pacientes/:id
 * Ficha completa del paciente: datos base + historial clínico + escalas
 * + documentos. Solo panel, dato clínico sensible.
 *
 * POST /api/pacientes/:id   body: { tipo: 'GAD-7'|'PHQ-9', puntaje, aplicadaEn? }
 * Registra una nueva medición de escala (sección 28 del doc). Fusionado
 * acá en vez de un archivo nuevo — límite de 12 funciones serverless
 * en Vercel Hobby, hoy sin margen (ver README).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sesion = await verificarSesion(req)
  if (!sesion) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  const { id } = req.query
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' })
  }

  if (req.method === 'POST') {
    const { tipo, puntaje, aplicadaEn } = req.body ?? {}
    if ((tipo !== 'GAD-7' && tipo !== 'PHQ-9') || typeof puntaje !== 'number' || puntaje < 0) {
      return res.status(400).json({ error: 'Datos de escala inválidos' })
    }

    try {
      const [escala] = await sql`
        insert into escalas_seguimiento (paciente_id, tipo, puntaje, aplicada_en)
        values (${id}, ${tipo}, ${puntaje}, coalesce(${aplicadaEn ?? null}::date, current_date))
        returning *
      `
      return res.status(201).json({ escala })
    } catch (err) {
      console.error('[POST /api/pacientes/:id]', err)
      return res.status(500).json({ error: 'Error al registrar la escala' })
    }
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Método no permitido' })
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
