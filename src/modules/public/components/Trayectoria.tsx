import { motion } from 'motion/react'
import { PuntosFondo } from '../../shared/components/Decoraciones'
import { LineasFondo } from '../../shared/components/LineasFondo'
import { TituloSeccion } from '../../shared/components/TituloSeccion'

const hitos = [
  {
    periodo: '2019 – 2024',
    institucion: 'Universidad Católica Boliviana',
    texto: 'Licenciatura en Psicología',
  },
  {
    periodo: '2022 – 2025',
    institucion: 'BYU-Idaho',
    texto: "Bachelor's en Marriage and Family Studies",
  },
  {
    periodo: '2025 – 2026',
    institucion: 'Hospital Israelita Albert Einstein (São Paulo)',
    texto: 'Especialización en Psicología Hospitalaria',
  },
  {
    periodo: 'Desde mayo 2026',
    institucion: 'Hospital Belga, Cochabamba',
    texto: 'Ejerce como psicóloga clínica',
  },
]

function HitoTimeline({
  periodo,
  institucion,
  texto,
  esUltimo,
}: {
  periodo: string
  institucion: string
  texto: string
  esUltimo: boolean
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="relative pl-10"
    >
      {/* Nodo + línea conectora, dibujados con el propio layout en
          vez de puntos sueltos sobre un border genérico. */}
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-sage-500 bg-cream-50"
      >
        <span className="h-2 w-2 rounded-full bg-sage-600" />
      </motion.span>
      {!esUltimo && (
        <motion.span
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ originY: 0 }}
          className="absolute left-[13px] top-8 h-[calc(100%-1rem)] w-px bg-sage-300"
        />
      )}

      <div className="pb-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">{periodo}</p>
        <p className="mt-1 font-serif-brand text-lg text-sage-900">{institucion}</p>
        <p className="mt-0.5 text-sm text-sage-700">{texto}</p>
      </div>
    </motion.li>
  )
}

export function Trayectoria() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-6">
      <LineasFondo variante="rama" className="-right-8 top-10 hidden h-96 w-60 md:block" />
      <PuntosFondo className="-left-10 bottom-0 h-44 w-64" />
      <div className="relative mx-auto max-w-3xl">
      <TituloSeccion>Trayectoria</TituloSeccion>
      <p className="mt-4 text-sage-700">
        Cada paso de mi formación ha sido intencional: construir una base clínica sólida y, al
        mismo tiempo, una mirada humana que no se queda solo en el diagnóstico.
      </p>
      <ol className="mt-10">
        {hitos.map((hito, i) => (
          <HitoTimeline key={hito.periodo} {...hito} esUltimo={i === hitos.length - 1} />
        ))}
      </ol>
      </div>
    </section>
  )
}
