import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Transición breve y discreta entre páginas: solo fade, sin
 * desplazamiento de posición — un slide/scale puede "marear" en
 * cambios de ruta frecuentes, un fade no. Con reduced motion,
 * duración 0 (cambio instantáneo, sin opacity animada).
 */
export function TransicionPagina({ children }: { children: ReactNode }) {
  const prefiereReducido = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefiereReducido ? 0 : 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
