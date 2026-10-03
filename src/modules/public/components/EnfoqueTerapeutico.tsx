import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'

/**
 * Texto real de Rebeca (mandado por Joshua, octubre 2026) — mismo
 * resumen que usa EnfoquePage.tsx para cada slug, no inventado
 * aparte. Si el texto cambia, actualizar en los dos lugares.
 */
const especialidades = [
  {
    slug: 'ansiedad',
    titulo: 'Ansiedad y preocupación constante',
    texto:
      'Comprender y afrontar pensamientos, preocupaciones y emociones que pueden estar interfiriendo en tu bienestar cotidiano.',
  },
  {
    slug: 'animo-bajo-depresion',
    titulo: 'Ánimo bajo y depresión',
    texto:
      'Trabajar sobre la pérdida de motivación, tristeza, aislamiento y otros cambios emocionales que afectan tu vida diaria.',
  },
  {
    slug: 'estres-sobrecarga',
    titulo: 'Estrés y sobrecarga emocional',
    texto:
      'Desarrollar herramientas para afrontar períodos de alta exigencia, cambios y situaciones que generan agotamiento emocional.',
  },
  {
    slug: 'procesos-de-salud',
    titulo: 'Procesos de salud y enfermedad',
    texto:
      'Acompañar el impacto emocional de un diagnóstico, tratamiento, hospitalización o convivencia con una condición médica.',
  },
  {
    slug: 'duelo-adaptacion',
    titulo: 'Duelo y procesos de adaptación',
    texto:
      'Encontrar un espacio para elaborar pérdidas y adaptarse a cambios importantes en distintas etapas de la vida.',
  },
  {
    slug: 'pareja',
    titulo: 'Dificultades en las relaciones',
    texto:
      'Comprender patrones de interacción, comunicación y emociones que pueden estar afectando los vínculos de pareja o familiares.',
  },
  {
    slug: 'transiciones-de-vida',
    titulo: 'Transiciones y momentos de cambio',
    texto:
      'Acompañar períodos de incertidumbre, decisiones importantes o cambios personales que pueden generar malestar emocional.',
  },
]

function TarjetaEspecialidad({
  slug,
  titulo,
  texto,
}: {
  slug: string
  titulo: string
  texto: string
}) {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springConfig = { stiffness: 200, damping: 20 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [7, -7]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-7, 7]), springConfig)

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  function handleMouseLeave() {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
    >
      <Link
        to={`/enfoques/${slug}`}
        className="block h-full rounded-2xl border border-sage-200 bg-cream-50 p-6 shadow-sm transition-shadow hover:shadow-lg"
      >
        <h3 className="text-lg font-semibold text-sage-800">{titulo}</h3>
        <p className="mt-3 text-sm text-sage-700">{texto}</p>
        <span className="mt-4 inline-block text-sm font-medium text-sage-600">
          Conocer más →
        </span>
      </Link>
    </motion.div>
  )
}

export function EnfoqueTerapeutico() {
  return (
    <section className="bg-sage-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-[var(--font-serif-brand)] text-3xl text-sage-900">
          Enfoque terapéutico
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {especialidades.map((item) => (
            <TarjetaEspecialidad key={item.slug} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
