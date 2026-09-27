export function ParaQuienEs() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-lg leading-relaxed text-sage-800">
        Esto te puede servir si sientes que la ansiedad, un diagnóstico médico, un cambio de
        vida o tu relación de pareja te están pesando más de lo que puedes manejar solo, y
        quieres un espacio serio, con evidencia clínica real, para trabajarlo.
      </p>

      {/* Aviso de crisis: visible, no en letra pequeña — no negociable */}
      <div className="mt-8 rounded-xl border-2 border-terracotta-300 bg-terracotta-50 p-6">
        <p className="text-base leading-relaxed text-terracotta-600">
          Si estás en una crisis aguda o piensas en hacerte daño, necesitas atención inmediata,
          no una cita agendada. Contáctame igual y te oriento sobre dónde buscar ayuda urgente,
          pero mi consulta no reemplaza una emergencia psiquiátrica.
        </p>
      </div>
    </section>
  )
}
