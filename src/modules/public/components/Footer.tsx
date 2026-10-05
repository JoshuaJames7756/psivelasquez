import { Link } from 'react-router-dom'
import { linkWhatsApp } from '../../shared/utils/whatsapp'

const numeroWhatsApp = '59160389762'

export function Footer() {
  return (
    <footer className="bg-forest-900 px-6 pb-8 pt-16 text-cream-100">
      <div className="mx-auto max-w-5xl">
        {/* Acción primero: lo que alguien que llega al footer buscando
            qué hacer necesita ver de inmediato (horarios o WhatsApp). */}
        <div className="flex flex-col items-start gap-4 border-b border-forest-700 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-[var(--font-serif-brand)] text-2xl text-cream-50">
              ¿Lista para empezar?
            </p>
            <p className="mt-1 text-sm text-cream-300">
              Mira los cupos disponibles o escríbeme directo.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/reservar"
              className="rounded-full bg-sage-600 px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-sage-500"
            >
              Ver horarios
            </Link>
            <a
              href={linkWhatsApp(numeroWhatsApp)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-cream-300/40 px-5 py-2.5 text-sm font-medium text-cream-100 transition-colors hover:border-cream-100"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Ubicación + redes */}
        <div className="grid gap-8 border-b border-forest-700 py-10 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cream-300/70">
              Dónde atiendo
            </p>
            <p className="mt-2 text-sm text-cream-200">
              Edif. VyV NUR
              <br />
              Parque Fidel Anze #200, Esq. Av. Pando
              <br />
              Cochabamba, Bolivia
            </p>
            <p className="mt-2 text-sm text-cream-300">Sábados, 09:00 a 17:00</p>
            <a
              href="https://maps.google.com/maps?q=Edif.+VyV+NUR+Parque+Fidel+Anze+200+Cochabamba"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm text-sage-300 underline transition-colors hover:text-sage-200"
            >
              Ver en el mapa
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cream-300/70">
              Redes
            </p>
            <div className="mt-2 flex flex-col gap-1.5 text-sm">
              <a
                href="https://instagram.com/psi.rebecavelasquez"
                className="text-cream-200 transition-colors hover:text-sage-300"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com/@psi.rebecavelasquez"
                className="text-cream-200 transition-colors hover:text-sage-300"
              >
                TikTok
              </a>
              <a
                href="https://linkedin.com/in/rebeca-velasquez-/"
                className="text-cream-200 transition-colors hover:text-sage-300"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Enlaces informativos + marca, discreto */}
        <div className="flex flex-col items-start justify-between gap-4 pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="font-[var(--font-serif-brand)] text-lg text-cream-200">RV</span>
            <span className="text-xs text-cream-300/70">Rebeca Velásquez, Psicóloga Clínica</span>
          </div>

          <div className="flex gap-5 text-xs text-cream-300">
            <Link to="/aviso-etico" className="underline transition-colors hover:text-sage-300">
              Aviso ético
            </Link>
            <a
              href="https://xiontech-seven.vercel.app"
              className="underline transition-colors hover:text-sage-300"
            >
              Sitio por Xion Technology
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
