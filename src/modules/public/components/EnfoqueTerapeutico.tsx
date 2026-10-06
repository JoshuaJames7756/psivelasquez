import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { enfoques, type Enfoque } from '../data/enfoques'

function ItemAcordeon({
  enfoque,
  abierto,
  onToggle,
}: {
  enfoque: Enfoque
  abierto: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-sage-200 last:border-b-0">
      <button
        onClick={onToggle}
        aria-expanded={abierto}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-semibold text-sage-800">{enfoque.titulo}</span>
        <motion.span
          animate={{ rotate: abierto ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-xl text-sage-400"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-5">
              <p className="text-sm leading-relaxed text-sage-700">{enfoque.resumen}</p>
              <Link
                to={`/enfoques/${enfoque.slug}`}
                className="mt-3 inline-block text-sm font-medium text-sage-600 transition-colors hover:text-sage-800"
              >
                Conocer más →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function EnfoqueTerapeutico() {
  const [abiertoSlug, setAbiertoSlug] = useState<string | null>(enfoques[0].slug)

  // Dos columnas en desktop: primeros 4 a la izquierda, resto a la
  // derecha — mantiene el acordeón legible sin una sola lista muy
  // larga en pantallas anchas.
  const mitad = Math.ceil(enfoques.length / 2)
  const columnaA = enfoques.slice(0, mitad)
  const columnaB = enfoques.slice(mitad)

  function manejarToggle(slug: string) {
    setAbiertoSlug((actual) => (actual === slug ? null : slug))
  }

  return (
    <section className="bg-sage-50 px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-[var(--font-serif-brand)] text-3xl text-sage-900">
          Enfoque terapéutico
        </h2>
        <p className="mt-3 text-sage-700">
          Estas son las áreas donde trabajo con más frecuencia. Toca una para conocer más.
        </p>

        <div className="mt-8 grid gap-x-10 md:grid-cols-2">
          <div>
            {columnaA.map((enfoque) => (
              <ItemAcordeon
                key={enfoque.slug}
                enfoque={enfoque}
                abierto={abiertoSlug === enfoque.slug}
                onToggle={() => manejarToggle(enfoque.slug)}
              />
            ))}
          </div>
          <div>
            {columnaB.map((enfoque) => (
              <ItemAcordeon
                key={enfoque.slug}
                enfoque={enfoque}
                abierto={abiertoSlug === enfoque.slug}
                onToggle={() => manejarToggle(enfoque.slug)}
              />
            ))}
          </div>
        </div>

        <Link
          to="/enfoques"
          className="mt-8 inline-block text-sm font-medium text-sage-600 underline transition-colors hover:text-sage-800"
        >
          Ver las 7 áreas completas
        </Link>
      </div>
    </section>
  )
}
