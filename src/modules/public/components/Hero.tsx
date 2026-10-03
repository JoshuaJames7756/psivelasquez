import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import rebecaHero from '../../../assets/fotos/rebeca-hero.jpg'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Profundidad sutil al hacer scroll: el hero se aleja y se desvanece levemente
  const y = useTransform(scrollYProgress, [0, 1], [0, 60])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4])

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream-50 px-6 py-20 md:py-28">
      <motion.div
        style={{ y, opacity }}
        className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="text-center md:text-left">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-block rounded-full bg-sage-100 px-4 py-1.5 text-sm font-medium text-sage-700"
          >
            Psicologa · Rebeca Velasquez
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-[var(--font-serif-brand)] text-4xl leading-tight text-sage-900 md:text-5xl"
          >
            Trabajo contigo desde lo clínico y desde tus vínculos, porque nadie enfrenta esto
            solo
          </motion.h1>

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
              transition={{ duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
            />
          </svg>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/reservar"
              className="mt-8 inline-block rounded-full bg-sage-700 px-8 py-3 text-base font-medium text-cream-50 shadow-sm transition-colors hover:bg-sage-800 hover:shadow-md"
            >
              Reservar sábado
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl bg-sage-100 md:mx-0"
        >
          <img
            src={rebecaHero}
            alt="Rebeca Velásquez, psicóloga clínica"
            className="h-full w-full object-cover"
            width={800}
            height={1067}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
