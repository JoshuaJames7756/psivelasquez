import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CabeceraPagina } from '../../shared/components/CabeceraPagina'
import { PuntosFondo } from '../../shared/components/Decoraciones'
import { IconoEnfoque } from '../components/IconoEnfoque'
import { enfoques } from '../data/enfoques'

export function EnfoquesIndexPage() {
  return (
    <main>
      <CabeceraPagina
        etiqueta="Áreas de trabajo"
        titulo="Enfoque terapéutico"
        intro="Estas son las áreas donde trabajo con más frecuencia. Elige la que más se acerque a tu situación para conocer cómo la abordamos juntos."
        estilo="circulos"
        tono="sage"
        ancho="max-w-5xl"
      />
      <section className="relative overflow-hidden px-6 pb-20 pt-6">
        <PuntosFondo className="-left-10 bottom-10 h-52 w-72" />
        <div className="relative mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enfoques.map((e, i) => (
            <motion.div
              key={e.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
            >
              <Link
                to={`/enfoques/${e.slug}`}
                className="group block h-full rounded-3xl border border-sage-200 bg-cream-50 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-100 text-sage-700 transition-colors group-hover:bg-terracotta-100 group-hover:text-terracotta-600">
                  <IconoEnfoque slug={e.slug} />
                </span>
                <h2 className="mt-4 font-serif-brand text-xl text-sage-900">{e.titulo}</h2>
                <p className="mt-3 text-sm text-sage-700">{e.resumen}</p>
                <span className="mt-4 inline-block text-sm font-medium text-sage-600">Conocer más →</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}
