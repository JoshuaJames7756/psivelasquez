import { LineasFondo } from '../../shared/components/LineasFondo'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import rebecaHero from '../../../assets/fotos/rebeca-hero.jpg'
import { useMotionSeguro } from '../../shared/hooks/useMotionSeguro'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const { desactivado, duracion } = useMotionSeguro()

  // Profundidad sutil al hacer scroll: el hero se aleja y se desvanece
  // levemente. Desactivado por completo con prefers-reduced-motion —
  // desplazamiento ligado al scroll es justo el tipo de movimiento
  // que puede marear a alguien sensible (sección 45 del doc).
  const y = useTransform(scrollYProgress, [0, 1], desactivado ? [0, 0] : [0, 60])
  const opacity = useTransform(scrollYProgress, [0, 1], desactivado ? [1, 1] : [1, 0.4])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-cream-50 px-6 pb-14 pt-14 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 rounded-full bg-terracotta-100/60 blur-3xl"
      />
      <motion.div
        style={{ y, opacity }}
        className="mx-auto grid max-w-6xl items-center gap-10 md:gap-12 md:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="text-center md:text-left">
          {/* Identidad primero: nombre + profesión. Hospital Belga y
              Beck Institute viven en Formación; acá no van, porque
              Hospital Belga es experiencia laboral y no su consultorio. */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duracion(0.5) }}
            className="mb-4 text-sm font-semibold uppercase tracking-wide text-sage-600"
          >
            Rebeca Velásquez — Psicóloga Clínica
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duracion(0.6), delay: 0.1 }}
            className="font-serif-brand text-4xl leading-tight text-sage-900 md:text-5xl"
          >
            Psicoterapia para atravesar momentos difíciles, con una mirada clínica y{' '}
            <span className="relative inline-block italic text-terracotta-600">
              cercana
              <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-2 w-full" fill="none" aria-hidden="true">
                <motion.path d="M1 5 C 25 1, 60 8, 99 3" stroke="var(--color-terracotta-300)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: duracion(0.8), delay: 1, ease: 'easeInOut' }} />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duracion(0.5), delay: 0.2 }}
            className="mt-4 text-base text-sage-700 md:text-lg"
          >
            Atiendo en Cochabamba, presencial y online.
          </motion.p>

          {/* Trazo de acento que se dibuja al cargar, bajo el título */}
          <svg
            viewBox="0 0 240 12"
            className="mx-auto mt-4 h-3 w-40 md:mx-0"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M2 8 C 60 2, 120 10, 238 4"
              stroke="var(--color-terracotta-400)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: duracion(0.9), delay: 0.5, ease: 'easeInOut' }}
            />
          </svg>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duracion(0.6), delay: 0.3 }}
          >
            <Link
              to="/reservar"
              className="mt-8 inline-block rounded-full bg-sage-700 px-8 py-3 text-base font-medium text-cream-50 shadow-sm transition-colors hover:bg-sage-800 hover:shadow-md"
            >
              Ver horarios disponibles
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: duracion(0.7), delay: 0.15 }}
          className="relative mx-auto w-full max-w-[240px] md:mx-0 md:max-w-sm"
        >
          <LineasFondo variante="contorno" className="-inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)]" />
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-3xl bg-sage-100">
            <img
              src={rebecaHero}
              alt="Rebeca Velásquez, psicóloga clínica"
              className="h-full w-full object-cover"
              width={800}
              height={1067}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
