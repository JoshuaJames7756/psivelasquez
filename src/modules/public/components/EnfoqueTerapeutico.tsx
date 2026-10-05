import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { enfoques, type Enfoque } from '../data/enfoques'
import { useMotionSeguro } from '../../shared/hooks/useMotionSeguro'

function TarjetaEspecialidad({ slug, titulo, resumen }: Enfoque) {
  const { desactivado } = useMotionSeguro()
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springConfig = { stiffness: 200, damping: 20 }
  // Tilt 3D es movimiento constante atado al cursor — justo lo que
  // prefers-reduced-motion pide evitar (sección 45 del doc). Con
  // rango [0,0] el valor nunca se mueve de 0 grados, tarjeta plana.
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], desactivado ? [0, 0] : [7, -7]),
    springConfig,
  )
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], desactivado ? [0, 0] : [-7, 7]),
    springConfig,
  )

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
        <p className="mt-3 text-sm text-sage-700">{resumen}</p>
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
          {enfoques.map((item) => (
            <TarjetaEspecialidad key={item.slug} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
