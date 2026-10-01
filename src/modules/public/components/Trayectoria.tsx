import { motion } from 'motion/react'

const hitos = [
  { periodo: '2019 – 2024', texto: 'Licenciatura en Psicología, Universidad Católica Boliviana' },
  { periodo: '2022 – 2025', texto: "Bachelor's en Marriage and Family Studies, BYU-Idaho" },
  {
    periodo: '2025 – 2026',
    texto: 'Especialización en Psicología Hospitalaria, Hospital Israelita Albert Einstein (São Paulo)',
  },
  { periodo: 'Desde mayo 2026', texto: 'Ejerce en el Hospital Belga, Cochabamba (parte-tiempo)' },
]

function HitoTimeline({ periodo, texto }: { periodo: string; texto: string }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="relative mb-8 last:mb-0"
    >
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full bg-sage-600"
      />
      <p className="text-sm font-semibold text-sage-600">{periodo}</p>
      <p className="mt-1 text-sage-800">{texto}</p>
    </motion.li>
  )
}

export function Trayectoria() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="font-[var(--font-serif-brand)] text-3xl text-sage-900">Trayectoria</h2>
      <p className="mt-4 text-sage-700">
        Cada paso de mi formación ha sido intencional: construir una base clínica sólida y, al
        mismo tiempo, una mirada humana que no se queda solo en el diagnóstico.
      </p>
      <ol className="mt-10 border-l-2 border-sage-300 pl-6">
        {hitos.map((hito) => (
          <HitoTimeline key={hito.periodo} {...hito} />
        ))}
      </ol>
    </section>
  )
}
