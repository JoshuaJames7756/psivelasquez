import { LineasFondo } from '../../shared/components/LineasFondo'
import { Link } from 'react-router-dom'
import { linkWhatsApp } from '../../shared/utils/whatsapp'

const numeroWhatsApp = '59160389762'

const navegacion = [
  { to: '/sobre-mi', label: 'Sobre mí' },
  { to: '/como-trabajo', label: 'Cómo trabajo' },
  { to: '/enfoques', label: 'Enfoques' },
  { to: '/formacion', label: 'Formación' },
  { to: '/modalidad', label: 'Modalidad' },
  { to: '/faq', label: 'Preguntas frecuentes' },
]

const redes = [
  { href: 'https://instagram.com/psi.rebecavelasquez', label: 'Instagram' },
  { href: 'https://tiktok.com/@psi.rebecavelasquez', label: 'TikTok' },
  { href: 'https://linkedin.com/in/rebeca-velasquez-/', label: 'LinkedIn' },
]

const tituloColumna = 'text-xs font-semibold uppercase tracking-wide text-cream-300/70'
const enlace = 'text-cream-200 transition-colors hover:text-sage-300'

export function Footer() {
  return (
    <footer className="con-grain relative overflow-hidden bg-forest-900 px-6 pb-8 pt-14 text-cream-100">
      {/* Acento orgánico muy tenue, solo para romper el plano */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-forest-700/50 blur-2xl"
      />
      <LineasFondo variante="ondas" className="inset-x-0 bottom-0 h-28 w-full text-forest-700/40" />

      <div className="relative mx-auto max-w-6xl">
        {/* 1) Acción primero */}
        <div className="flex flex-col items-start gap-4 border-b border-forest-700 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif-brand text-2xl text-cream-50">
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

        {/* 2) Información en columnas */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 lg:grid-cols-4 lg:gap-x-10">
          <div className="col-span-2 lg:col-span-1">
            <p className="font-serif-brand text-xl text-cream-50">
              Rebeca Velásquez
            </p>
            <p className="mt-1 text-sm text-sage-300">Psicóloga Clínica</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-300">
              Psicoterapia con enfoque cognitivo-conductual para adolescentes y adultos.
            </p>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <p className={tituloColumna}>Dónde atiendo</p>
            <p className="mt-3 text-sm leading-relaxed text-cream-200">
              Edif. VyV NUR
              <br />
              Parque Fidel Anze #200, Esq. Av. Pando
              <br />
              Cochabamba, Bolivia
            </p>
            <p className="mt-2 text-sm text-cream-300">Sábados, 09:00 a 17:00</p>
            <p className="mt-2 text-sm text-cream-300">Presencial y online</p>
            <a
              href="https://maps.google.com/maps?q=Edif.+VyV+NUR+Parque+Fidel+Anze+200+Cochabamba"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-sage-300 underline transition-colors hover:text-sage-200"
            >
              Ver en el mapa
            </a>
          </div>

          <div>
            <p className={tituloColumna}>Explorar</p>
            <ul className="mt-3 space-y-2 text-sm">
              {navegacion.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={enlace}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={tituloColumna}>Redes</p>
            <ul className="mt-3 space-y-2 text-sm">
              {redes.map((r) => (
                <li key={r.label}>
                  <a href={r.href} target="_blank" rel="noreferrer" className={enlace}>
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3) Legal y crédito, discreto */}
        <div className="flex flex-col gap-3 border-t border-forest-700 pt-6 text-xs text-cream-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Rebeca Velásquez. Todos los derechos reservados.</p>
          <div className="flex gap-5">
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
