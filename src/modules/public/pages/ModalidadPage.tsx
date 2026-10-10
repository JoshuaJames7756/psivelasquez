import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CabeceraPagina } from '../../shared/components/CabeceraPagina'
import { FormaFlotante, PuntosFondo } from '../../shared/components/Decoraciones'
import { MapaUbicacion } from '../components/MapaUbicacion'

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay },
})

const MAPS = 'https://www.google.com/maps/search/?api=1&query=Edif.+VyV+NUR+Parque+Fidel+Anze+200+Cochabamba'

function Icono({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        {children}
      </svg>
    </span>
  )
}

const trazo = { stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/**
 * Orden de lectura: 1) cómo atiendo (dos opciones del mismo peso),
 * 2) cuándo (horario como dato destacado), 3) dónde (mapa), 4) reservar.
 */
export function ModalidadPage() {
  return (
    <main>
      <CabeceraPagina
        etiqueta="Cómo atiendo"
        titulo="Modalidad"
        intro="Atiendo un solo día a la semana para poder darle a cada sesión la atención que merece. Puedes elegir la modalidad que prefieras al reservar."
        estilo="puntos"
        tono="sage"
        ancho="max-w-4xl"
      />

      <div className="relative overflow-hidden px-6 pb-20 pt-6">
        <FormaFlotante className="-right-20 top-40 h-64 w-64" color="bg-terracotta-100/50" />
        <div className="relative mx-auto max-w-4xl space-y-8">
          <div className="grid gap-5 md:grid-cols-2">
            <motion.article {...reveal()} className="rounded-3xl border border-sage-200 bg-cream-50 p-6 shadow-sm">
              <Icono>
                <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" {...trazo} />
                <circle cx="12" cy="11" r="2.2" {...trazo} />
              </Icono>
              <h2 className="mt-4 font-serif-brand text-2xl text-sage-900">Presencial</h2>
              <p className="mt-2 text-sm leading-relaxed text-sage-700">
                Edif. VyV NUR
                <br />
                Parque Fidel Anze #200, Esq. Av. Pando
                <br />
                Cochabamba
              </p>
              <a
                href={MAPS}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-medium text-sage-700 underline decoration-terracotta-300 underline-offset-4 hover:text-sage-900"
              >
                Cómo llegar
              </a>
            </motion.article>

            <motion.article {...reveal(0.08)} className="rounded-3xl border border-sage-200 bg-cream-50 p-6 shadow-sm">
              <Icono>
                <rect x="3" y="6" width="12" height="12" rx="2.5" {...trazo} />
                <path d="M15 10.5l6-3v9l-6-3z" {...trazo} />
              </Icono>
              <h2 className="mt-4 font-serif-brand text-2xl text-sage-900">Online</h2>
              <p className="mt-2 text-sm leading-relaxed text-sage-700">
                Videollamada, el enlace se coordina por WhatsApp antes de tu sesión.
              </p>
            </motion.article>
          </div>

          <motion.section
            {...reveal()}
            className="relative overflow-hidden rounded-3xl border border-terracotta-100 bg-terracotta-50 px-6 py-7 md:px-10"
          >
            <PuntosFondo className="-right-6 -top-4 h-32 w-48" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta-600">Horario</p>
                <p className="mt-1 font-serif-brand text-3xl text-sage-900">Sábados</p>
              </div>
              <p className="font-serif-brand text-3xl text-sage-800">
                09:00 <span className="text-terracotta-400">a</span> 17:00
              </p>
            </div>
          </motion.section>

          <motion.section {...reveal()}>
            <h2 className="mb-3 font-serif-brand text-xl text-sage-900">Dónde encontrarme</h2>
            <MapaUbicacion />
          </motion.section>

          <motion.div {...reveal()} className="text-center">
            <Link
              to="/reservar"
              className="inline-block rounded-full bg-sage-700 px-8 py-3 text-base font-medium text-cream-50 shadow-sm transition-colors hover:bg-sage-800"
            >
              Ver horarios disponibles
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
