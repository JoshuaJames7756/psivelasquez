import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useMotionSeguro } from '../hooks/useMotionSeguro'
import { LineasFondo } from './LineasFondo'
import { RV_TRAZO } from './monogramaRV'

const MENSAJES = [
  'Preparando tu espacio',
  'Verificando tu sesión de forma segura',
  'Ordenando la agenda del sábado',
  'Casi listo',
]

/** Monograma "RV" que respira, con anillo giratorio y puntos en órbita. */
function Monograma({ tamano, animado }: { tamano: number; animado: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: tamano, height: tamano }}>
      {/* Resplandor que pulsa detrás del monograma */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-[-30%] rounded-full bg-sage-400/25 blur-2xl"
        animate={animado ? { opacity: [0.35, 0.9, 0.35], scale: [0.9, 1.1, 0.9] } : { opacity: 0.5 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Anillo de trazos que gira */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="absolute inset-[-14%] h-[128%] w-[128%] text-sage-300"
        animate={animado ? { rotate: 360 } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 5" opacity="0.7" />
      </motion.svg>

      {/* Anillo de arco que gira al revés */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="absolute inset-[-6%] h-[112%] w-[112%] text-terracotta-300"
        animate={animado ? { rotate: -360 } : undefined}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1.4"
          strokeLinecap="round" strokeDasharray="60 242"
        />
      </motion.svg>

      {/* Puntos en órbita */}
      {animado &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute inset-[-24%]"
            initial={{ rotate: i * 120 }}
            animate={{ rotate: i * 120 + 360 }}
            transition={{ duration: 9 + i * 2, repeat: Infinity, ease: 'linear' }}
          >
            <span className={`absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${i === 1 ? 'bg-terracotta-300' : 'bg-sage-200'}`} />
          </motion.span>
        ))}

      {/* Placa con las letras */}
      <motion.svg
        viewBox="0 0 64 64"
        className="relative h-full w-full drop-shadow-lg"
        aria-hidden="true"
        initial={animado ? { scale: 0.7, opacity: 0, rotate: -6 } : false}
        animate={
          animado
            ? { scale: [1, 1.05, 1], opacity: 1, rotate: 0 }
            : { scale: 1, opacity: 1, rotate: 0 }
        }
        transition={{
          scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 0.5 },
          rotate: { duration: 0.7, ease: 'easeOut' },
        }}
      >
        <rect width="64" height="64" rx="15" fill="#3e5638" />
        <motion.path
          d={RV_TRAZO}
          fill="#fdfbf7"
          initial={animado ? { opacity: 0, y: 4 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: 'easeOut' }}
        />
        <motion.path
          d="M17 50 C 26 46, 38 53, 47 48"
          fill="none"
          stroke="#d0785a"
          strokeWidth="3"
          strokeLinecap="round"
          initial={animado ? { pathLength: 0 } : false}
          animate={animado ? { pathLength: [0, 1, 1, 0], pathOffset: [0, 0, 0, 1] } : { pathLength: 1 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.45, 0.75, 1] }}
        />
      </motion.svg>
    </div>
  )
}

/** Frase que cambia cada par de segundos, con fundido. */
function MensajeRotativo({ animado }: { animado: boolean }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!animado) return
    const t = setInterval(() => setI((v) => Math.min(v + 1, MENSAJES.length - 1)), 1900)
    return () => clearInterval(t)
  }, [animado])

  return (
    <div className="relative h-6 w-full text-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={animado ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={animado ? { opacity: 0, y: -8 } : undefined}
          transition={{ duration: 0.35 }}
          className="absolute inset-x-0 text-sm text-sage-200"
        >
          {MENSAJES[i]}
          {animado && <PuntosSuspensivos />}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

function PuntosSuspensivos() {
  return (
    <span aria-hidden="true" className="ml-0.5 inline-flex w-4 justify-start">
      {[0, 1, 2].map((n) => (
        <motion.span
          key={n}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: n * 0.2 }}
        >
          .
        </motion.span>
      ))}
    </span>
  )
}

/**
 * Pantalla de carga del panel. Dos variantes:
 * - "completa": cubre toda la ventana (entrada al panel, mientras Clerk
 *   verifica la sesión y se descarga el código del panel).
 * - "seccion": más discreta, para cambios de pantalla dentro del panel.
 *
 * Con prefers-reduced-motion queda estática (sin giros ni pulsos) pero
 * sigue anunciando "Cargando" a lectores de pantalla.
 */
export function PantallaCarga({ variante = 'completa' }: { variante?: 'completa' | 'seccion' }) {
  const { desactivado } = useMotionSeguro()
  const animado = !desactivado

  // En cambios de sección evitamos el parpadeo si carga en menos de 250 ms.
  const [visible, setVisible] = useState(variante === 'completa')
  useEffect(() => {
    if (variante === 'completa') return
    const t = setTimeout(() => setVisible(true), 250)
    return () => clearTimeout(t)
  }, [variante])

  if (variante === 'seccion') {
    return (
      <div role="status" aria-live="polite" className="flex min-h-[50vh] items-center justify-center">
        <span className="sr-only">Cargando</span>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-5"
          >
            <Monograma tamano={56} animado={animado} />
            <PuntosSuspensivos />
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-forest-900 px-6 text-cream-50"
    >
      <span className="sr-only">Cargando el panel</span>

      <LineasFondo variante="rama" className="-bottom-10 -right-12 h-96 w-72 text-forest-700" />
      <LineasFondo variante="ondas" className="left-0 top-0 h-40 w-full text-forest-700 opacity-70" />

      {/* Motas que suben lentamente */}
      {animado &&
        Array.from({ length: 10 }).map((_, n) => (
          <motion.span
            key={n}
            aria-hidden="true"
            className="absolute bottom-0 h-1 w-1 rounded-full bg-sage-300/50"
            style={{ left: `${8 + n * 9.5}%` }}
            animate={{ y: [0, -420 - (n % 3) * 120], opacity: [0, 0.8, 0] }}
            transition={{ duration: 7 + (n % 4), repeat: Infinity, delay: n * 0.6, ease: 'easeOut' }}
          />
        ))}

      <div className="relative flex w-full max-w-xs flex-col items-center gap-9">
        <Monograma tamano={104} animado={animado} />

        <div className="w-full space-y-3 text-center">
          <motion.p
            initial={animado ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-serif-brand text-2xl text-cream-50"
          >
            Rebeca Velásquez
          </motion.p>
          <MensajeRotativo animado={animado} />
        </div>

        {/* Barra indeterminada */}
        <div aria-hidden="true" className="relative h-1 w-44 overflow-hidden rounded-full bg-forest-700">
          <motion.span
            className="absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-sage-400 via-sage-200 to-terracotta-300"
            animate={animado ? { x: ['-100%', '200%'] } : { x: '50%' }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  )
}
