-- ============================================================
-- Migración 006: estados de cita ampliados (Prompt 2.0, sección 55)
-- ============================================================
-- Flujo real confirmado: solicitada -> confirmada -> pagada,
-- secuencial (no independientes). 'confirmada' pasa a significar
-- "Rebeca separó el horario" y 'pagada' "llegó el comprobante del
-- 50%" — son dos pasos, no dos estados que pueden darse en
-- cualquier orden.
--
-- 'completada': la sesión efectivamente ocurrió (se marca después
-- del sábado, manual por Rebeca o por un job futuro).
-- 'cancelada': el paciente avisó que no viene — distinto de
-- 'liberada' (Rebeca libera por falta de pago/vencimiento) porque
-- cancelada sí tuvo intención de asistir y avisó, es información
-- de seguimiento distinta.
--
-- ALTER TYPE ... ADD VALUE no puede correr dentro de la misma
-- transacción que lo usa inmediatamente después (limitación de
-- Postgres), así que esta migración SOLO agrega los valores. Nada
-- más se cambia acá.
-- ------------------------------------------------------------

alter type estado_cita add value if not exists 'pagada' after 'confirmada';
alter type estado_cita add value if not exists 'completada' after 'pagada';
alter type estado_cita add value if not exists 'cancelada' after 'completada';
