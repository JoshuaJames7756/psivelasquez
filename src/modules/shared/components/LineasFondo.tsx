import { motion } from 'motion/react'
import { useMotionSeguro } from '../hooks/useMotionSeguro'

type Variante = 'ondas' | 'contorno' | 'rama' | 'circulos' | 'hojas'

/**
 * Líneas decorativas de fondo: trazos finos que se dibujan una vez al
 * entrar en pantalla. Rompen la sensación de "pared de color" sin
 * competir con el contenido (baja opacidad, aria-hidden, sin
 * interacción). Con prefers-reduced-motion aparecen ya dibujadas.
 *
 * El contenedor padre necesita position relative + overflow-hidden.
 * Este svg es absolute por sí mismo; no depende de reglas globales.
 */
const trazos: Record<Variante, { viewBox: string; paths: string[] }> = {
  ondas: {
    viewBox: '0 0 800 200',
    paths: [
      'M0 60 C 120 10, 220 110, 340 60 S 560 10, 680 60 S 780 100, 800 80',
      'M0 110 C 120 60, 220 160, 340 110 S 560 60, 680 110 S 780 150, 800 130',
      'M0 160 C 120 110, 220 200, 340 160 S 560 110, 680 160 S 780 190, 800 180',
    ],
  },
  contorno: {
    viewBox: '0 0 400 500',
    paths: [
      'M200 20 C 90 20, 20 110, 20 230 C 20 380, 100 480, 200 480 C 300 480, 380 380, 380 230 C 380 110, 310 20, 200 20 Z',
      'M200 50 C 110 50, 50 125, 50 230 C 50 360, 115 450, 200 450 C 285 450, 350 360, 350 230 C 350 125, 290 50, 200 50 Z',
    ],
  },
  circulos: {
    viewBox: '0 0 400 400',
    paths: [
      'M40 200 a160 160 0 1 0 320 0 a160 160 0 1 0 -320 0',
      'M90 200 a110 110 0 1 0 220 0 a110 110 0 1 0 -220 0',
      'M140 200 a60 60 0 1 0 120 0 a60 60 0 1 0 -120 0',
    ],
  },
  hojas: {
    viewBox: '0 0 300 300',
    paths: [
      'M20 280 C 80 230, 150 160, 270 40',
      'M90 215 C 70 180, 80 150, 105 130 C 125 155, 120 190, 90 215 Z',
      'M150 160 C 130 125, 140 95, 165 75 C 185 100, 180 135, 150 160 Z',
      'M200 112 C 225 105, 245 115, 255 135 C 230 145, 210 135, 200 112 Z',
      'M60 250 C 90 255, 115 245, 125 225 C 95 215, 70 225, 60 250 Z',
    ],
  },
  rama: {
    viewBox: '0 0 300 400',
    paths: [
      'M150 390 C 150 300, 140 220, 150 120 C 155 80, 150 40, 150 10',
      'M150 300 C 110 290, 80 260, 60 220',
      'M150 240 C 190 230, 225 200, 245 160',
      'M150 180 C 115 170, 95 145, 85 110',
      'M150 130 C 180 120, 200 100, 210 70',
    ],
  },
}

export function LineasFondo({
  variante = 'ondas',
  className = '',
}: {
  variante?: Variante
  className?: string
}) {
  const { desactivado, duracion } = useMotionSeguro()
  const { viewBox, paths } = trazos[variante]

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute text-sage-300/50 ${className}`}
    >
      {paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={1.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: desactivado ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: duracion(1.8), delay: duracion(i * 0.25), ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}
