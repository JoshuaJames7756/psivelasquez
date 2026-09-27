-- ============================================================
-- Rebeca Velásquez — Sitio + Panel Clínico
-- Migración 001: esquema base (Neon / PostgreSQL)
-- ============================================================
-- Principio: el frontend nunca toca esta base directamente.
-- Todo acceso pasa por /api con verificación de rol server-side
-- (Clerk). Este esquema no depende de RLS de Postgres porque el
-- control de acceso vive en el backend, no en la DB.
-- ============================================================

-- ------------------------------------------------------------
-- Extensiones
-- ------------------------------------------------------------
create extension if not exists "pgcrypto"; -- para gen_random_uuid()

-- ------------------------------------------------------------
-- ENUMs — el flujo de estados vive en el tipo, no en texto libre
-- ------------------------------------------------------------

-- Flujo real de una cita, sin pasarela de pago:
-- disponible -> solicitada -> confirmada -> (liberada | vencida)
create type estado_cita as enum (
  'disponible',
  'solicitada',
  'confirmada',
  'liberada',
  'vencida'
);

create type modalidad_cita as enum ('presencial', 'online');

create type estado_paciente as enum ('activo', 'pausado', 'alta');

-- Tipo de escala de seguimiento clínico soportada
create type tipo_escala as enum ('GAD-7', 'PHQ-9');

-- ------------------------------------------------------------
-- pacientes
-- ------------------------------------------------------------
create table pacientes (
  id                uuid primary key default gen_random_uuid(),
  nombre            text not null,
  edad              smallint check (edad > 0 and edad < 120),
  telefono          text,               -- WhatsApp, formato libre con código país
  motivo_inicial    text,               -- texto libre del formulario de reserva
  primera_vez       boolean not null default true,
  estado            estado_paciente not null default 'activo',
  creado_en         timestamptz not null default now(),
  actualizado_en    timestamptz not null default now()
);

create index idx_pacientes_estado on pacientes (estado);
create index idx_pacientes_nombre on pacientes (lower(nombre));
-- Búsqueda "por nombre" en el panel: LIKE/ILIKE sobre este índice alcanza
-- para el volumen esperado (8 cupos/semana). Ver 002_pg_trgm.sql (opcional)
-- para búsqueda difusa si el volumen de pacientes crece mucho.

-- ------------------------------------------------------------
-- slots_sabado — grilla pre-generada, 8 cupos por sábado (9am-5pm)
-- ------------------------------------------------------------
-- Se generan por adelantado (job semanal o manual) para que la
-- página pública siempre tenga algo que mostrar, y para que Rebeca
-- pueda bloquear un horario sin que exista un interesado todavía.
create table slots_sabado (
  id                uuid primary key default gen_random_uuid(),
  fecha             date not null,           -- el sábado en cuestión
  hora_inicio       time not null,           -- ej. 09:00, 10:00 ... 16:00
  modalidad         modalidad_cita,          -- null hasta que se solicita/confirma
  estado            estado_cita not null default 'disponible',
  paciente_id       uuid references pacientes(id) on delete set null,
  solicitado_en     timestamptz,             -- cuándo pasó a "solicitada"
  expira_en         timestamptz,             -- solicitado_en + 24-48h, calculado en backend
  confirmado_en     timestamptz,
  notas_reserva     text,                    -- motivo breve capturado en el form de reserva
  creado_en         timestamptz not null default now(),
  actualizado_en    timestamptz not null default now(),

  constraint uq_slot_fecha_hora unique (fecha, hora_inicio),
  -- Un slot no puede estar "confirmada" sin paciente asociado
  constraint chk_confirmada_tiene_paciente check (
    estado <> 'confirmada' or paciente_id is not null
  )
);

create index idx_slots_fecha on slots_sabado (fecha);
create index idx_slots_estado on slots_sabado (estado);
create index idx_slots_paciente on slots_sabado (paciente_id);

-- Las "citas" del doc son estos mismos slots una vez con paciente
-- asociado — no se separan en dos tablas para no duplicar el estado.

-- ------------------------------------------------------------
-- tag_clinico — catálogo reutilizable de categorías clínicas
-- ------------------------------------------------------------
create table tag_clinico (
  id      uuid primary key default gen_random_uuid(),
  nombre  text not null unique,   -- ej. "ansiedad", "duelo", "pareja"
  color   text                    -- hex opcional, para chip visual en el panel
);

-- ------------------------------------------------------------
-- historial_clinico — notas de sesión con autoguardado
-- ------------------------------------------------------------
create table historial_clinico (
  id                uuid primary key default gen_random_uuid(),
  paciente_id       uuid not null references pacientes(id) on delete cascade,
  slot_id           uuid references slots_sabado(id) on delete set null,
  motivo            text,                    -- texto libre
  intervencion      text,                    -- texto libre
  tareas_homework   text,
  proximos_pasos    text,                    -- destacado visualmente en el panel
  creado_en         timestamptz not null default now(),
  -- se pisa en cada autoguardado; no hay botón manual de "guardar"
  actualizado_en    timestamptz not null default now()
);

create index idx_historial_paciente on historial_clinico (paciente_id);
create index idx_historial_slot on historial_clinico (slot_id);

-- Tags clínicos aplicados a una nota de historial (muchos a muchos)
create table historial_tag (
  historial_id  uuid not null references historial_clinico(id) on delete cascade,
  tag_id        uuid not null references tag_clinico(id) on delete cascade,
  primary key (historial_id, tag_id)
);

-- ------------------------------------------------------------
-- documentos_paciente — adjuntos (Cloudinary)
-- ------------------------------------------------------------
create table documentos_paciente (
  id            uuid primary key default gen_random_uuid(),
  paciente_id   uuid not null references pacientes(id) on delete cascade,
  url           text not null,        -- URL de Cloudinary
  nombre        text not null,
  tipo          text,                 -- mime type
  subido_en     timestamptz not null default now()
);

create index idx_documentos_paciente on documentos_paciente (paciente_id);

-- ------------------------------------------------------------
-- escalas_seguimiento — GAD-7 / PHQ-9 graficadas en el tiempo
-- ------------------------------------------------------------
create table escalas_seguimiento (
  id            uuid primary key default gen_random_uuid(),
  paciente_id   uuid not null references pacientes(id) on delete cascade,
  tipo          tipo_escala not null,
  puntaje       smallint not null check (puntaje >= 0),
  aplicada_en   date not null default current_date,
  creado_en     timestamptz not null default now()
);

create index idx_escalas_paciente_tipo on escalas_seguimiento (paciente_id, tipo, aplicada_en);

-- ------------------------------------------------------------
-- Trigger genérico: mantener actualizado_en al día
-- ------------------------------------------------------------
create or replace function set_actualizado_en()
returns trigger as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_pacientes_actualizado
  before update on pacientes
  for each row execute function set_actualizado_en();

create trigger trg_slots_actualizado
  before update on slots_sabado
  for each row execute function set_actualizado_en();

create trigger trg_historial_actualizado
  before update on historial_clinico
  for each row execute function set_actualizado_en();
