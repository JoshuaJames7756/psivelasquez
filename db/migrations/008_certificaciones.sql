-- ============================================================
-- Migración 008: certificaciones (Prompt 2.0, sección 16)
-- ============================================================
-- institucion, nombre, año, categoría, descripción, y el documento
-- (PDF o imagen) subido a Cloudinary vía el mismo flujo de firma que
-- ya existe para documentos de pacientes (api/documentos/firma.ts).
-- ------------------------------------------------------------

create table certificaciones (
  id            uuid primary key default gen_random_uuid(),
  institucion   text not null,
  nombre        text not null,
  anio          smallint,
  categoria     text,              -- ej. "Beck Institute", "BYU-Idaho/Pathway"
  descripcion   text,
  documento_url text,              -- PDF o imagen en Cloudinary, opcional
  orden         smallint not null default 0,  -- orden manual de despliegue
  creado_en     timestamptz not null default now()
);

create index idx_certificaciones_orden on certificaciones (orden);
