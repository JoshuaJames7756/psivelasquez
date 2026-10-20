import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../../server-lib/auth.js'
import { registrarAuditoria } from '../../server-lib/auditoria.js'
import { generarCsv } from '../../server-lib/csv.js'
import { sql } from '../../server-lib/db.js'
import { textoOpcionalValido } from '../../server-lib/validar.js'

const SEMANAS_RIESGO_DEFAULT = 3

/**
 * GET /api/pacientes?q=nombre           — búsqueda por nombre
 * GET /api/pacientes?en_riesgo=1        — alertas de abandono (Hoy)
 * GET /api/pacientes?exportar=pacientes — CSV con la lista de pacientes
 * GET /api/pacientes?exportar=sesiones  — CSV con las notas de sesión
 *
 * Solo panel. Dato clínico, nunca accesible sin sesión válida.
 * Fusionado desde pacientes/index.ts + pacientes/en-riesgo.ts para
 * bajar el conteo de funciones serverless (límite de 12 en Vercel
 * Hobby).
 *
 * Definición de "en riesgo": paciente activo cuya última cita PAGADA
 * o COMPLETADA fue hace más de N semanas, y que NO tiene ningún slot
 * futuro en solicitada/confirmada/pagada. (Corregido tras el cambio
 * de estados ampliados — 'confirmada' ya no implica que la sesión se
 * haya dado, ver migración 006.)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const sesion = await verificarSesion(req)
  if (!sesion) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  // POST: alta manual de un paciente (por ejemplo, alguien que agenda
  // por WhatsApp y nunca pasó por el formulario del sitio).
  if (req.method === 'POST') {
    const { nombre, edad, telefono, motivoInicial } = req.body ?? {}
    if (typeof nombre !== 'string' || nombre.trim().length < 2 || nombre.length > 120) {
      return res.status(400).json({ error: 'El nombre es requerido (máx. 120 caracteres)' })
    }
    if (!textoOpcionalValido(telefono, 30) || !textoOpcionalValido(motivoInicial, 1000)) {
      return res.status(400).json({ error: 'Teléfono o motivo demasiado largo' })
    }
    if (edad !== undefined && edad !== null && (!Number.isInteger(edad) || edad < 0 || edad > 120)) {
      return res.status(400).json({ error: 'Edad no válida' })
    }
    try {
      const [paciente] = await sql`
        insert into pacientes (nombre, edad, telefono, motivo_inicial, primera_vez)
        values (${nombre.trim()}, ${edad ?? null}, ${telefono || null}, ${motivoInicial || null}, true)
        returning *
      `
      registrarAuditoria({
        usuarioId: sesion.userId,
        tipoEvento: 'creacion_paciente',
        pacienteId: paciente.id,
        detalle: 'alta manual desde el panel',
      })
      return res.status(201).json({ paciente })
    } catch (err) {
      console.error('[POST /api/pacientes]', err)
      return res.status(500).json({ error: 'Error al crear el paciente' })
    }
  }

  // Exportación CSV. Es dato clínico completo, por eso: sesión válida,
  // un registro de auditoría (solo qué se exportó, sin contenido) y
  // respuesta sin caché.
  if (req.query.exportar === 'pacientes' || req.query.exportar === 'sesiones') {
    const tipo = req.query.exportar
    try {
      let csv: string
      if (tipo === 'pacientes') {
        const rows = await sql`
          select p.nombre, p.edad, p.telefono, p.estado, p.primera_vez, p.motivo_inicial,
                 p.creado_en,
                 (select max(s.fecha) from slots_sabado s
                   where s.paciente_id = p.id and s.estado in ('pagada', 'completada')) as ultima_sesion,
                 (select count(*) from slots_sabado s
                   where s.paciente_id = p.id and s.estado in ('pagada', 'completada')) as sesiones
          from pacientes p
          order by lower(p.nombre) asc
        `
        csv = generarCsv(
          ['Nombre', 'Edad', 'Teléfono', 'Estado', 'Primera vez', 'Motivo inicial', 'Alta en el sistema', 'Última sesión', 'Sesiones'],
          rows.map((r) => [
            r.nombre, r.edad, r.telefono, r.estado, r.primera_vez ? 'Sí' : 'No',
            r.motivo_inicial, r.creado_en, r.ultima_sesion, r.sesiones,
          ]),
        )
      } else {
        const rows = await sql`
          select p.nombre, h.creado_en, s.fecha as fecha_cita, h.motivo, h.intervencion,
                 h.tareas_homework, h.proximos_pasos,
                 coalesce((select string_agg(t.nombre, ', ' order by t.nombre)
                           from historial_tag ht join tag_clinico t on t.id = ht.tag_id
                           where ht.historial_id = h.id), '') as tags
          from historial_clinico h
          join pacientes p on p.id = h.paciente_id
          left join slots_sabado s on s.id = h.slot_id
          order by lower(p.nombre) asc, h.creado_en asc
        `
        csv = generarCsv(
          ['Paciente', 'Nota creada', 'Fecha de la cita', 'Motivo', 'Intervención', 'Tareas', 'Próximos pasos', 'Etiquetas'],
          rows.map((r) => [
            r.nombre, r.creado_en, r.fecha_cita, r.motivo, r.intervencion,
            r.tareas_homework, r.proximos_pasos, r.tags,
          ]),
        )
      }
      await registrarAuditoria({
        usuarioId: sesion.userId,
        tipoEvento: 'accion_administrativa',
        detalle: `exportó CSV de ${tipo}`,
      })
      res.setHeader('Content-Type', 'text/csv; charset=utf-8')
      res.setHeader('Content-Disposition', `attachment; filename="${tipo}-${new Date().toISOString().slice(0, 10)}.csv"`)
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).send(csv)
    } catch (err) {
      console.error('[GET /api/pacientes?exportar]', err)
      return res.status(500).json({ error: 'No se pudo generar la exportación' })
    }
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
        join slots_sabado s on s.paciente_id = p.id and s.estado in ('pagada', 'completada')
        where p.estado = 'activo'
          and not exists (
            select 1 from slots_sabado sf
            where sf.paciente_id = p.id
              and sf.estado in ('solicitada', 'confirmada', 'pagada')
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
  const termino = typeof q === 'string' ? q.trim().slice(0, 80) : ''

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
