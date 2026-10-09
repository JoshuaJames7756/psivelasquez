import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useMotionSeguro } from '../hooks/useMotionSeguro'

/**
 * Título de sección con un trazo terracota que se dibuja al entrar
 * en pantalla. Un solo patrón para todas las secciones: consistencia
 * visual sin repetir markup. El trazo es decorativo (aria-hidden).
 */
export function TituloSeccion({
  children,
  className = '',
  centrado = false,
}: {
  children: ReactNode
  className?: string
  centrado?: boolean
}) {
  const { desactivado, duracion } = useMotionSeguro()

  return (
    <div className={centrado ? 'text-center' : ''}>
      <h2 className={`font-serif-brand text-3xl text-sage-900 ${className}`}>{children}</h2>
      <svg
        viewBox="0 0 120 10"
        className={`mt-2 h-2.5 w-24 ${centrado ? 'mx-auto' : ''}`}
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d="M2 6 C 30 1, 60 9, 118 3"
          stroke="var(--color-terracotta-400)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: desactivado ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: duracion(0.8), ease: 'easeInOut' }}
        />
      </svg>
    </div>
  )
}
