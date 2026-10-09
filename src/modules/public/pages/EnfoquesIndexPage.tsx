import { Link } from 'react-router-dom'
import { enfoques } from '../data/enfoques'

export function EnfoquesIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="font-serif-brand text-4xl text-sage-900">
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
