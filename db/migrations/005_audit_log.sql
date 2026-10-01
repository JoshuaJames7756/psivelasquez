-- ============================================================
-- Migración 005: audit log (Prompt 2.0, secciones 33 y 38)
-- ============================================================
-- Registra eventos relevantes de seguridad y acceso, NUNCA contenido
-- clínico completo (sección 33: "No guardar contenido clínico
-- completo en logs innecesarios"). El campo `detalle` es para
-- metadata operativa (qué paciente, qué acción), no para el texto de
-- una nota clínica.
-- ------------------------------------------------------------

create type tipo_evento_auditoria as enum (
  'login',
  'logout',
  'acceso_paciente',
  'acceso_historial',
  'creacion_paciente',
  'modificacion_paciente',
  'modificacion_historial',
  'eliminacion_documento',
  'cambio_estado_cita',
  'accion_administrativa'
);

create table audit_log (
  id            uuid primary key default gen_random_uuid(),
  usuario_id    text not null,        -- userId de Clerk (no FK, vive fuera de esta DB)
  tipo_evento   tipo_evento_auditoria not null,
  paciente_id   uuid references pacientes(id) on delete set null,
  detalle       text,                 -- metadata breve, NUNCA contenido clínico
  creado_en     timestamptz not null default now()
);

create index idx_audit_log_usuario on audit_log (usuario_id);
create index idx_audit_log_paciente on audit_log (paciente_id);
create index idx_audit_log_creado on audit_log (creado_en desc);
