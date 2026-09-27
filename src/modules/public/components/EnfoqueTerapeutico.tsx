import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { MouseEvent } from 'react'

const especialidades = [
  {
    titulo: 'Ansiedad',
    texto:
      'Te ayudo a identificar qué la dispara y a construir herramientas concretas de TCC para manejarla, no solo a hablar de ella.',
  },
  {
    titulo: 'Procesos de salud',
    texto:
      'Sé lo que significa acompañar a alguien en un diagnóstico difícil, lo viví de cerca en el Hospital Belga y en Albert Einstein. Trabajamos juntos tu proceso emocional, no solo el médico.',
  },
  {
    titulo: 'Transiciones vitales',
    texto:
      'Mudanzas, duelos, decisiones grandes, cualquier momento donde sientes que el piso se mueve, trabajamos para que encuentres estabilidad de nuevo.',
  },
  {
    titulo: 'Pareja',
    texto:
      'Mi formación en Marriage and Family Studies me da una mirada distinta: no busco culpables, busco entender la dinámica que los tiene atrapados.',
  },
]

function TarjetaEspecialidad({ titulo, texto }: { titulo: string; texto: string }) {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springConfig = { stiffness: 200, damping: 20 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [7, -7]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-7, 7]), springConfig)

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
    <motion.article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="rounded-2xl border border-sage-200 bg-cream-50 p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <h3 className="text-lg font-semibold text-sage-800">{titulo}</h3>
      <p className="mt-3 text-sage-700">{texto}</p>
    </motion.article>
  )
}

export function EnfoqueTerapeutico() {
  return (
    <section className="bg-sage-50 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-[var(--font-serif-brand)] text-3xl text-sage-900">
          Enfoque terapéutico
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {especialidades.map((item) => (
            <TarjetaEspecialidad key={item.titulo} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
