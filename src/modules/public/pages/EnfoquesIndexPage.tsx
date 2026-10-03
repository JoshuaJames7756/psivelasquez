import { Link } from 'react-router-dom'

/** Mismo texto real de Rebeca que EnfoquePage.tsx y EnfoqueTerapeutico.tsx. */
const enfoques = [
  {
    slug: 'ansiedad',
    titulo: 'Ansiedad y preocupación constante',
    resumen:
      'Comprender y afrontar pensamientos, preocupaciones y emociones que pueden estar interfiriendo en tu bienestar cotidiano.',
  },
  {
    slug: 'animo-bajo-depresion',
    titulo: 'Ánimo bajo y depresión',
    resumen:
      'Trabajar sobre la pérdida de motivación, tristeza, aislamiento y otros cambios emocionales que afectan tu vida diaria.',
  },
  {
    slug: 'estres-sobrecarga',
    titulo: 'Estrés y sobrecarga emocional',
    resumen:
      'Desarrollar herramientas para afrontar períodos de alta exigencia, cambios y situaciones que generan agotamiento emocional.',
  },
  {
    slug: 'procesos-de-salud',
    titulo: 'Procesos de salud y enfermedad',
    resumen:
      'Acompañar el impacto emocional de un diagnóstico, tratamiento, hospitalización o convivencia con una condición médica.',
  },
  {
    slug: 'duelo-adaptacion',
    titulo: 'Duelo y procesos de adaptación',
    resumen:
      'Encontrar un espacio para elaborar pérdidas y adaptarse a cambios importantes en distintas etapas de la vida.',
  },
  {
    slug: 'pareja',
    titulo: 'Dificultades en las relaciones',
    resumen:
      'Comprender patrones de interacción, comunicación y emociones que pueden estar afectando los vínculos de pareja o familiares.',
  },
  {
    slug: 'transiciones-de-vida',
    titulo: 'Transiciones y momentos de cambio',
    resumen:
      'Acompañar períodos de incertidumbre, decisiones importantes o cambios personales que pueden generar malestar emocional.',
  },
]

export function EnfoquesIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="font-[var(--font-serif-brand)] text-4xl text-sage-900">
        Enfoque terapéutico
      </h1>
      <p className="mt-4 max-w-2xl text-sage-700">
        Estas son las áreas donde trabajo con más frecuencia. Elige la que más se acerque a tu
        situación para conocer cómo la abordamos juntos.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enfoques.map((e) => (
          <Link
            key={e.slug}
            to={`/enfoques/${e.slug}`}
            className="block rounded-2xl border border-sage-200 bg-cream-50 p-6 shadow-sm transition-shadow hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-sage-800">{e.titulo}</h2>
            <p className="mt-3 text-sm text-sage-700">{e.resumen}</p>
            <span className="mt-4 inline-block text-sm font-medium text-sage-600">
              Conocer más →
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
