-- ============================================================
-- OPCIONAL — solo aplicar si la búsqueda por nombre en el panel
-- se vuelve lenta o se necesita tolerancia a errores de tipeo.
-- No es parte del arranque, no correr junto con 001 por defecto.
-- ============================================================

create extension if not exists pg_trgm;

drop index if exists idx_pacientes_nombre;
create index idx_pacientes_nombre_trgm on pacientes using gin (nombre gin_trgm_ops);
