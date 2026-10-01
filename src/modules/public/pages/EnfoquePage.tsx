import { useParams } from 'react-router-dom'

/**
 * PLACEHOLDER DE CONTENIDO — el doc (sección 14) pide, para cada una
 * de las 4 áreas, desarrollar: introducción, qué significa la
 * problemática, situaciones frecuentes, cómo puede sentirse, cuándo
 * consultar, cómo trabaja Rebeca este tema, qué puede esperar la
 * persona, preguntas frecuentes propias, y un CTA. Es contenido
 * clínico específico por área — no corresponde inventarlo genérico,
 * necesita que Rebeca lo desarrolle (o al menos lo revise) tema por
 * tema antes de publicar.
 */
const titulos: Record<string, string> = {
  ansiedad: 'Ansiedad',
  'procesos-de-salud': 'Procesos de salud',
  'transiciones-de-vida': 'Transiciones de vida',
  pareja: 'Pareja',
}

export function EnfoquePage() {
  const { slug } = useParams<{ slug: string }>()
  const titulo = (slug && titulos[slug]) || 'Enfoque'

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-[var(--font-serif-brand)] text-4xl text-sage-900">{titulo}</h1>
      <p className="mt-6 text-lg text-sage-500">
        Contenido pendiente de desarrollo para esta área — introducción, situaciones frecuentes,
        cómo trabaja Rebeca este tema, y preguntas frecuentes específicas.
      </p>
    </main>
  )
}
