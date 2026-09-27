const pasos = [
  'Contacto por WhatsApp, coordinamos el sábado',
  'Reserva con adelanto del 50% (protege el cupo)',
  'Primera sesión, sin presión de tener todo claro',
  'Definimos juntos frecuencia y forma del proceso',
]

export function PrimeraSesion() {
  return (
    <section className="bg-cream-100 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-[var(--font-serif-brand)] text-3xl text-sage-900">
          Qué esperar en tu primera sesión
        </h2>
        <ol className="mt-10 space-y-6">
          {pasos.map((paso, i) => (
            <li key={paso} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-700 text-sm font-semibold text-cream-50">
                {i + 1}
              </span>
              <span className="pt-1 text-sage-800">{paso}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
