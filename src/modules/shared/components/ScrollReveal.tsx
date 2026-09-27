import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Wrapper reutilizable de reveal-on-scroll: fade + leve desplazamiento
 * hacia arriba. Usado para las secciones que no tienen motion propio
 * (Sobre Rebeca, Para quién es, Primera sesión, Modalidad y agenda),
 * para mantener consistencia sin sobrecargar cada componente.
 */
export function ScrollReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
