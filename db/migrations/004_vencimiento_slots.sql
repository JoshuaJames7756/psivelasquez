-- ============================================================
-- Migración 004: vencimiento automático de slots solicitados
-- ============================================================
-- Un slot "solicitada" cuya expira_en ya pasó (ventana de 24-48h sin
-- que Rebeca confirme el pago) vuelve a "disponible" automáticamente
-- — decisión confirmada: sin paso intermedio manual, para que el
-- cupo quede libre para otra persona sin que Rebeca tenga que
-- acordarse de liberarlo. El paciente que no confirmó queda
-- registrado igual en la tabla pacientes (no se borra su fila),
-- solo se desvincula del slot.
--
-- En vez de depender de un cron aparte (el plan Hobby de Vercel solo
-- permite 1 corrida/día, ya usada por generar-slots), esto se
-- resuelve con una función que se llama al inicio de cualquier
-- lectura sobre slots_sabado — el vencimiento es efectivamente
-- inmediato (correcto en la siguiente consulta que toque la tabla)
-- sin necesitar infraestructura de scheduling adicional.
-- ------------------------------------------------------------

-- Nota: el valor 'vencida' del enum estado_cita queda sin uso real en
-- este flujo (vence directo a 'disponible', sin paso intermedio). Se
-- mantiene en el tipo por si más adelante se quiere trazabilidad de
-- "esto venció antes de liberarse", pero hoy ninguna función lo asigna.

create or replace function vencer_slots_expirados()
returns void as $$
begin
  update slots_sabado
  set estado = 'disponible',
      paciente_id = null,
      modalidad = null,
      notas_reserva = null,
      solicitado_en = null,
      expira_en = null,
      confirmado_en = null
  where estado = 'solicitada'
    and expira_en is not null
    and expira_en < now();
end;
$$ language plpgsql;
