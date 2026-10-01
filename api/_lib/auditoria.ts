import { sql } from './db.js'

export type TipoEventoAuditoria =
  | 'login'
  | 'logout'
  | 'acceso_paciente'
  | 'acceso_historial'
  | 'creacion_paciente'
  | 'modificacion_paciente'
  | 'modificacion_historial'
  | 'eliminacion_documento'
  | 'cambio_estado_cita'
  | 'accion_administrativa'

/**
 * Registra un evento de auditoría. NUNCA pasar contenido clínico
 * completo en `detalle` (sección 33 del Prompt 2.0) — solo metadata
 * breve ("confirmó cita", "editó historial de sesión del 12/10").
 *
 * No lanza si falla: un error de auditoría no debe tumbar la acción
 * real que se estaba auditando. Se loguea a consola para no perder
 * la señal de que algo falló.
 */
export async function registrarAuditoria(params: {
  usuarioId: string
  tipoEvento: TipoEventoAuditoria
  pacienteId?: string
  detalle?: string
}) {
  try {
    await sql`
      insert into audit_log (usuario_id, tipo_evento, paciente_id, detalle)
      values (${params.usuarioId}, ${params.tipoEvento}, ${params.pacienteId ?? null}, ${params.detalle ?? null})
    `
  } catch (err) {
    console.error('[auditoria] No se pudo registrar evento', params.tipoEvento, err)
  }
}
