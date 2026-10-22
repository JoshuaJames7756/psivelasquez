-- ============================================================
-- Migración 012: constancia del consentimiento en la reserva
-- ============================================================
-- Guarda cuándo y bajo qué versión de la política de privacidad
-- aceptó la persona al solicitar un cupo desde el sitio. Es aditiva:
-- el código anterior sigue funcionando si se corre antes del deploy.
-- Los pacientes creados a mano desde el panel quedan en null.
-- ------------------------------------------------------------

alter table pacientes
  add column if not exists consentimiento_en timestamptz,
  add column if not exists consentimiento_version text;
