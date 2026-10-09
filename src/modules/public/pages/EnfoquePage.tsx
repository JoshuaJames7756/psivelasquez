import { Link, useParams } from 'react-router-dom'
import { buscarEnfoque } from '../data/enfoques'

/**
 * El doc (sección 14) pide además, por cada área: qué significa la
 * problemática, situaciones frecuentes, cómo puede sentirse, cuándo
 * consultar, cómo trabaja Rebeca este tema, qué puede esperar la
 * persona, y preguntas frecuentes propias — ESO sigue pendiente,
 * es contenido más extenso que el resumen corto que mandó. El
 * resumen ya se puede publicar tal cual; el desarrollo profundo por
 * página todavía necesita que Rebeca lo escriba o lo apruebe.
 */
export function EnfoquePage() {
  const { slug } = useParams<{ slug: string }>()
  const enfoque = buscarEnfoque(slug)

  if (!enfoque) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-serif-brand text-3xl text-sage-900">
          No encontramos esta área
        </h1>
        <Link to="/" className="mt-4 inline-block text-sage-600 underline">
          Volver al inicio
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-serif-brand text-4xl text-sage-900">{enfoque.titulo}</h1>
      <p className="mt-6 text-lg leading-relaxed text-sage-700">{enfoque.resumen}</p>

      {/* Pendiente (sección 14 del doc): situaciones frecuentes, cómo
          puede sentirse, cuándo consultar, cómo trabaja Rebeca este
          tema específico, qué puede esperar la persona, FAQ propia. */}

      <Link
        to="/reservar"
        className="mt-10 inline-block rounded-full bg-sage-700 px-6 py-2.5 text-sm font-medium text-cream-50 hover:bg-sage-800"
      >
        Reservar una sesión
      </Link>
    </main>
  )
}
