import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

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
    <section
      ref={ref}
      className="relative overflow-hidden bg-cream-50 px-6 py-28 text-center md:py-36"
    >
      <motion.div style={{ y, opacity }} className="mx-auto max-w-3xl">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-block rounded-full bg-sage-100 px-4 py-1.5 text-sm font-medium text-sage-700"
        >
          Hospital Belga · Beck Institute
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-[var(--font-serif-brand)] text-4xl leading-tight text-sage-900 md:text-5xl"
        >
          Trabajo contigo desde lo clínico y desde tus vínculos,
          <br className="hidden md:block" /> porque nadie enfrenta esto solo
        </motion.h1>

        {/* Trazo de acento que se dibuja al cargar, bajo el título */}
        <svg
          viewBox="0 0 240 12"
          className="mx-auto mt-4 h-3 w-40"
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

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300 } }}
          className="mt-8 rounded-full bg-sage-700 px-8 py-3 text-base font-medium text-cream-50 shadow-sm transition-colors hover:bg-sage-800 hover:shadow-md"
        >
          Reservar sábado
        </motion.button>
      </motion.div>
    </section>
  )
}
