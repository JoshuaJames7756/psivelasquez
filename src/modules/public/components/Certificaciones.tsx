const certificaciones = [
  { institucion: 'Beck Institute', curso: 'CBT for Anxiety' },
  { institucion: 'Beck Institute', curso: 'CBT for Depression' },
  { institucion: 'Beck Institute', curso: 'Basics of CBT: Essentials I' },
  { institucion: 'BYU-Idaho / BYU-Pathway', curso: 'Certificación 1' },
  { institucion: 'BYU-Idaho / BYU-Pathway', curso: 'Certificación 2' },
  { institucion: 'BYU-Idaho / BYU-Pathway', curso: 'Certificación 3' },
  { institucion: 'BYU-Idaho / BYU-Pathway', curso: 'Certificación 4' },
]

/**
 * Única sección de contraste oscuro real del sitio (verde bosque profundo).
 * Grid estilo LinkedIn: preview del PDF, logo institución, fecha, "ver credencial".
 * Placeholder de contenido: faltan fechas/credential IDs reales y PDFs de Rebeca.
 */
export function Certificaciones() {
  return (
    <section className="bg-forest-900 px-6 py-20 text-cream-50">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-[var(--font-serif-brand)] text-3xl">Certificaciones</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {certificaciones.map((c, i) => (
            <div
              key={i}
              className="rounded-xl border border-forest-700 bg-forest-800 p-5"
            >
              <div className="h-32 rounded-lg bg-forest-700" />
              <p className="mt-4 text-sm text-sage-300">{c.institucion}</p>
              <p className="font-medium">{c.curso}</p>
              <button className="mt-4 text-sm text-terracotta-300 hover:underline">
                Ver credencial
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
