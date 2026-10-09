-- ============================================================
-- Migración 010: notas rápidas
-- ============================================================
-- Bloc de notas ágil del panel (recordatorios sueltos, ideas, algo que
-- Rebeca quiere anotar entre sesiones). Opcionalmente ligada a un
-- paciente. Distinta de historial_clinico, que son las notas formales
-- de cada sesión.
-- ------------------------------------------------------------

create table notas_rapidas (
  id          uuid primary key default gen_random_uuid(),
  texto       text not null check (length(texto) between 1 and 2000),
  paciente_id uuid references pacientes(id) on delete set null,
  creado_en   timestamptz not null default now()
);

create index idx_notas_rapidas_creado on notas_rapidas (creado_en desc);
