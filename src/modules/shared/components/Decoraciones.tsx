import { motion } from 'motion/react'
import { useMotionSeguro } from '../hooks/useMotionSeguro'

/**
 * Formas decorativas suaves que flotan despacio. Siempre dentro de un
 * contenedor con position relative + overflow-hidden (son absolute),
 * por eso nunca ocupan espacio ni generan scroll horizontal.
 * Con prefers-reduced-motion quedan quietas.
 */
export function FormaFlotante({
  className = '',
  color = 'bg-terracotta-100/60',
  recorrido = 14,
  duracionCiclo = 9,
}: {
  className?: string
  color?: string
  recorrido?: number
  duracionCiclo?: number
}) {
  const { desactivado } = useMotionSeguro()
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-2xl ${color} ${className}`}
      animate={desactivado ? undefined : { y: [0, -recorrido, 0], x: [0, recorrido / 2, 0] }}
      transition={{ duration: duracionCiclo, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/** Trama de puntos que se desvanece hacia los bordes. */
export function PuntosFondo({ className = '' }: { className?: string }) {
  const { desactivado, duracion } = useMotionSeguro()
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: desactivado ? 1 : 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: duracion(1.2) }}
      className={`pointer-events-none absolute text-sage-400/40 [background-image:radial-gradient(currentColor_1.4px,transparent_1.4px)] [background-size:18px_18px] [mask-image:radial-gradient(closest-side,black,transparent)] ${className}`}
    />
  )
}

/** Anillo discontinuo que gira muy lento. */
export function AnilloGiratorio({
  className = '',
  segundos = 60,
}: {
  className?: string
  segundos?: number
}) {
  const { desactivado } = useMotionSeguro()
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute text-terracotta-300/60 ${className}`}
      animate={desactivado ? undefined : { rotate: 360 }}
      transition={{ duration: segundos, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 5" strokeLinecap="round" />
    </motion.svg>
  )
}
