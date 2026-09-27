-- ============================================================
-- Migración 003: configuración editable por Rebeca desde el panel
-- ============================================================
-- El precio de sesión NO se publica en el sitio (se coordina por
-- WhatsApp), pero el panel lo necesita para estimar ingreso del mes.
-- Tabla clave-valor simple: evita hardcodear el número en el código
-- y evita crear una tabla nueva cada vez que aparece un ajuste más.
-- ------------------------------------------------------------

create table configuracion (
  clave           text primary key,
  valor           text not null,
  actualizado_en  timestamptz not null default now()
);

create trigger trg_configuracion_actualizado
  before update on configuracion
  for each row execute function set_actualizado_en();

-- Precio por sesión en Bs, editable desde el panel. Sin valor inicial
-- real: Rebeca lo carga la primera vez que entra a Configuración.
insert into configuracion (clave, valor)
values ('precio_sesion_bob', '0')
on conflict (clave) do nothing;
