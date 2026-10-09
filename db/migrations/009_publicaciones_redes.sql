-- ============================================================
-- Migración 009: publicaciones de redes sociales
-- ============================================================
-- Contenido de Instagram/TikTok que Rebeca quiere mostrar en el sitio.
-- No se embebe el reproductor de la red (cargaría scripts de terceros
-- y rastreadores): se guarda el enlace + una miniatura propia en
-- Cloudinary, y la tarjeta abre la publicación en la red social.
-- ------------------------------------------------------------

create table publicaciones_redes (
  id            uuid primary key default gen_random_uuid(),
  plataforma    text not null check (plataforma in ('instagram', 'tiktok')),
  url           text not null,
  titulo        text,
  miniatura_url text,                       -- imagen en Cloudinary, opcional
  visible       boolean not null default true,
  orden         smallint not null default 0,
  creado_en     timestamptz not null default now()
);

create index idx_publicaciones_redes_orden on publicaciones_redes (visible, orden, creado_en desc);
