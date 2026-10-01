import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-forest-900 px-6 py-14 text-cream-100">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        <p className="font-[var(--font-serif-brand)] text-4xl">RV</p>

        <div className="flex gap-6">
          {/* Iconos SVG propios por red social, hover animado — pendiente diseño */}
          <a href="https://wa.me/59160389762" className="text-cream-200 hover:text-sage-300">
            WhatsApp
          </a>
          <a
            href="https://instagram.com/psi.rebecavelasquez"
            className="text-cream-200 hover:text-sage-300"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com/@psi.rebecavelasquez"
            className="text-cream-200 hover:text-sage-300"
          >
            TikTok
          </a>
          <a
            href="https://linkedin.com/in/rebeca-velasquez-/"
            className="text-cream-200 hover:text-sage-300"
          >
            LinkedIn
          </a>
        </div>

        <p className="text-sm text-cream-300">
          Edif. VyV NUR, Parque Fidel Anze #200, Esq. Av. Pando, Cochabamba
        </p>

        <Link to="/aviso-etico" className="text-xs text-cream-300 underline hover:text-sage-300">
          Aviso ético
        </Link>

        <p className="text-xs text-cream-300">
          Sitio construido por{' '}
          <a
            href="https://xiontech-seven.vercel.app"
            className="underline hover:text-sage-300"
          >
            Xion Technology
          </a>
        </p>
      </div>
    </footer>
  )
}
