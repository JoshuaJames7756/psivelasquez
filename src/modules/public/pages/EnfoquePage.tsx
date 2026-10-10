import { motion } from 'motion/react'
import { Link, useParams } from 'react-router-dom'
import { CabeceraPagina } from '../../shared/components/CabeceraPagina'
import { FormaFlotante } from '../../shared/components/Decoraciones'
import { LineasFondo } from '../../shared/components/LineasFondo'
import { IconoEnfoque } from '../components/IconoEnfoque'
import { buscarEnfoque, enfoques } from '../data/enfoques'

/**
 * Detalle de un área. Hoy solo hay título + resumen reales (texto de
 * Rebeca). Las secciones "qué es", "señales" y "cómo puede ayudar" se
 * dibujan SOLO si el dato existe en data/enfoques.ts: es contenido
 * clínico y no se inventa; cuando Rebeca lo escriba, aparece solo.
 */
export function EnfoquePage() {
  const { slug } = useParams<{ slug: string }>()
  const enfoque = buscarEnfoque(slug)

  if (!enfoque) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-serif-brand text-3xl text-sage-900">No encontramos esta área</h1>
        <Link to="/enfoques" className="mt-4 inline-block text-sage-600 underline">
          Ver todas las áreas
        </Link>
      </main>
    )
  }

  const otras = enfoques.filter((e) => e.slug !== enfoque.slug).slice(0, 3)

  return (
    <main>
      <CabeceraPagina
        etiqueta="Área de trabajo"
        titulo={enfoque.titulo}
        intro={enfoque.resumen}
        estilo="ondas"
        tono="terracota"
        icono={
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-50 text-sage-700 shadow-sm">
            <IconoEnfoque slug={enfoque.slug} className="h-7 w-7" />
          </span>
        }
      />

      <div className="relative overflow-hidden px-6 pb-20 pt-6">
        <LineasFondo variante="hojas" className="-left-10 top-20 hidden h-64 w-64 md:block" />
        <div className="relative mx-auto max-w-3xl space-y-8">
          {enfoque.queEs && (
            <section>
              <h2 className="font-serif-brand text-xl text-sage-900">¿Qué es?</h2>
              <p className="mt-2 text-sage-700">{enfoque.queEs}</p>
            </section>
          )}

          {enfoque.senales && enfoque.senales.length > 0 && (
            <section>
              <h2 className="font-serif-brand text-xl text-sage-900">Algunas señales comunes</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {enfoque.senales.map((t) => (
                  <li key={t} className="flex gap-3 rounded-2xl border border-sage-200 bg-cream-50 p-4 text-sm text-sage-800">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
                        <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {enfoque.comoAyuda && (
            <section className="rounded-3xl bg-sage-100 p-6">
              <h2 className="font-serif-brand text-xl text-sage-900">¿Cómo puede ayudar la terapia?</h2>
              <p className="mt-2 text-sage-800">{enfoque.comoAyuda}</p>
            </section>
          )}

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-terracotta-100 bg-terracotta-50 p-8 text-center"
          >
            <FormaFlotante className="-right-10 -top-10 h-40 w-40" color="bg-terracotta-100/80" />
            <p className="relative font-serif-brand text-2xl text-sage-900">¿Te identificas con esto?</p>
            <p className="relative mt-2 text-sm text-sage-700">
              Puedes escribirme o reservar un horario y lo conversamos en la primera sesión.
            </p>
            <Link
              to="/reservar"
              className="relative mt-5 inline-block rounded-full bg-sage-700 px-6 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-sage-800"
            >
              Reservar una sesión
            </Link>
          </motion.section>

          <section>
            <h2 className="font-serif-brand text-xl text-sage-900">Otras áreas</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {otras.map((e) => (
                <Link
                  key={e.slug}
                  to={`/enfoques/${e.slug}`}
                  className="group rounded-2xl border border-sage-200 bg-cream-50 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-100 text-sage-700 group-hover:bg-terracotta-100 group-hover:text-terracotta-600">
                    <IconoEnfoque slug={e.slug} className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-sm font-medium text-sage-900">{e.titulo}</p>
                </Link>
              ))}
            </div>
            <Link to="/enfoques" className="mt-4 inline-block text-sm font-medium text-sage-600 underline">
              Ver todas las áreas
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
