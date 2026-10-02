import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../server-lib/auth.js'
import { sql, vencerSlotsExpirados } from '../server-lib/db.js'

const SEMANAS_RIESGO_DEFAULT = 3

/**
 * GET /api/seguimiento
 * Solo panel. Reúne en un solo lugar las señales derivadas de
 * "esto necesita tu atención" (Prompt 2.0, secciones 30 y 57):
 *
 *   - solicitadas: slots en 'solicitada' esperando que Rebeca
 *     confirme el horario
 *   - confirmadasSinPago: slots en 'confirmada' esperando el
 *     comprobante del 50%
 *   - pacientesEnRiesgo: activos sin agendar hace 3+ semanas
 *
 * Deliberadamente NO incluye "documentos faltantes" (mencionado en
 * el doc) porque no existe todavía el concepto de qué documento
 * debería existir por paciente — agregarlo ahora sería inventar una
 * regla de negocio sin base real.
 *
 * Un solo endpoint (no tres) para no sumar más funciones serverless
 * al límite de 12 del plan Hobby de Vercel — hoy en 11, este es el
 * último margen disponible sin consolidar de nuevo.
 *
 * Nota: la query de pacientesEnRiesgo duplica la lógica de
 * GET /api/pacientes?en_riesgo=1 (usada en Hoy). Trade-off deliberado:
 * mantener este endpoint autocontenido (una sola llamada HTTP desde
 * el frontend) en vez de que la página de Seguimiento haga dos
 * fetches separados. Si la definición de "en riesgo" cambia, hay que
 * actualizarla en los DOS lugares.
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

  try {
    await vencerSlotsExpirados()

    const [solicitadas, confirmadasSinPago, pacientesEnRiesgo] = await Promise.all([
      sql`
        select s.id, s.fecha, s.hora_inicio, p.nombre as paciente_nombre, p.telefono as paciente_telefono
        from slots_sabado s
        join pacientes p on p.id = s.paciente_id
        where s.estado = 'solicitada'
        order by s.solicitado_en asc
      `,
      sql`
        select s.id, s.fecha, s.hora_inicio, p.nombre as paciente_nombre, p.telefono as paciente_telefono
        from slots_sabado s
        join pacientes p on p.id = s.paciente_id
        where s.estado = 'confirmada'
        order by s.confirmado_en asc
      `,
      sql`
        select
          p.id, p.nombre, p.telefono,
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
        having max(s.fecha) < current_date - (${SEMANAS_RIESGO_DEFAULT}::int * interval '1 week')
        order by max(s.fecha) asc
      `,
    ])

    return res.status(200).json({ solicitadas, confirmadasSinPago, pacientesEnRiesgo })
  } catch (err) {
    console.error('[GET /api/seguimiento]', err)
    return res.status(500).json({ error: 'Error al calcular el seguimiento' })
  }
}
