-- ============================================================
-- Migración 007: tareas (Prompt 2.0, sección 31)
-- ============================================================

create type estado_tarea as enum ('todo', 'en_progreso', 'hecha', 'cancelada');
create type prioridad_tarea as enum ('baja', 'media', 'alta');

create table tareas (
  id              uuid primary key default gen_random_uuid(),
  titulo          text not null,
  descripcion     text,
  prioridad       prioridad_tarea not null default 'media',
  fecha_limite    date,
  estado          estado_tarea not null default 'todo',
  paciente_id     uuid references pacientes(id) on delete set null,
  creado_en       timestamptz not null default now(),
  actualizado_en  timestamptz not null default now()
);

create index idx_tareas_estado on tareas (estado);
create index idx_tareas_fecha on tareas (fecha_limite);
create index idx_tareas_paciente on tareas (paciente_id);

create trigger trg_tareas_actualizado
  before update on tareas
  for each row execute function set_actualizado_en();
