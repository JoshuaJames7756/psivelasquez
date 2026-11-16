import { motion } from 'motion/react'
import { FormaFlotante } from '../../shared/components/Decoraciones'
import { LineasFondo } from '../../shared/components/LineasFondo'
import { TituloSeccion } from '../../shared/components/TituloSeccion'

/**
 * V1: lista fija con lo que está documentado del proyecto (instituciones).
 * V2: completar nombre exacto, año y documento de cada certificación.
 * Nunca agregar títulos o certificaciones que no estén confirmados.
 */
const certificaciones = [
  {
    institucion: 'Beck Institute',
    nombre: 'Certificaciones del Beck Institute',
    detalle: 'Formación vinculada al enfoque cognitivo-conductual en el que se basa mi trabajo.',
  },
  {
    institucion: 'BYU-Idaho',
    nombre: 'Formación académica y complementaria',
    detalle: "Incluye el Bachelor's en Marriage and Family Studies.",
  },
  {
    institucion: 'BYU-Pathway',
    nombre: 'Formación en BYU-Pathway',
    detalle: 'Programa de formación complementaria.',
  },
]

const fondoSeccion =
  'relative overflow-hidden bg-gradient-to-b from-cream-100 via-sage-50 to-sage-100/70 px-6 py-16 md:py-20'

export function Certificaciones() {
  return (
    <section className={fondoSeccion}>
      <LineasFondo variante="circulos" className="-right-28 -top-28 h-96 w-96" />
      <FormaFlotante className="bottom-6 -left-10 h-56 w-56" color="bg-terracotta-100/50" />
      <div className="relative mx-auto max-w-5xl">
        <TituloSeccion>Certificaciones</TituloSeccion>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {certificaciones.map((c, i) => (
            <motion.div
              key={c.institucion}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-3xl border border-sage-200 bg-cream-50 p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">{c.institucion}</p>
              <p className="mt-2 font-serif-brand text-xl text-sage-900">{c.nombre}</p>
              <p className="mt-2 text-sm leading-relaxed text-sage-700">{c.detalle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
