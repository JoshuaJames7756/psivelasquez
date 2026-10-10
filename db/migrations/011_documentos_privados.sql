-- Documentos de pacientes privados (Cloudinary type "authenticated").
-- Los documentos anteriores quedan con privado = false (enlace público
-- antiguo). Los nuevos se suben como "authenticated" y solo se abren
-- con un enlace firmado que vence a los pocos minutos.
alter table documentos_paciente
  add column if not exists public_id     text,
  add column if not exists resource_type text,
  add column if not exists formato       text,
  add column if not exists privado       boolean not null default false;
