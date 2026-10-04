/**
 * Texto real de Rebeca (mandado por Joshua, octubre 2026) — no es
 * placeholder genérico. Fuente única de verdad: usado por
 * EnfoqueTerapeutico.tsx (tarjetas de Home), EnfoquesIndexPage.tsx
 * (índice /enfoques) y EnfoquePage.tsx (detalle /enfoques/:slug).
 * Si el texto cambia, se edita acá una sola vez.
 */
export interface Enfoque {
  slug: string
  titulo: string
  resumen: string
}

export const enfoques: Enfoque[] = [
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

export function buscarEnfoque(slug: string | undefined): Enfoque | undefined {
  return enfoques.find((e) => e.slug === slug)
}
