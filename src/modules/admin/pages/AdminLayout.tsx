import { UserButton } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import rebecaAvatar from '../../../assets/fotos/rebeca-avatar.jpg'
import { LineasFondo } from '../../shared/components/LineasFondo'
import { NavAdmin } from '../components/NavAdmin'

function Menu({ onNavegar }: { onNavegar?: () => void }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-forest-900 px-4 pb-5 pt-6 text-cream-50">
      <LineasFondo variante="rama" className="-bottom-6 -right-10 h-72 w-56 text-forest-700" />

      <div className="relative mb-8 flex items-center gap-3 px-2">
        <img
          src={rebecaAvatar}
          alt=""
          width={80}
          height={80}
          className="h-11 w-11 rounded-full object-cover ring-2 ring-sage-300/60"
        />
        <div className="min-w-0">
          <p className="font-serif-brand truncate text-base leading-tight text-cream-50">
            Rebeca Velásquez
          </p>
          <p className="text-xs text-sage-300">Psicóloga clínica</p>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto">
        <NavAdmin onNavegar={onNavegar} />
      </div>

      <Link
        to="/"
        target="_blank"
        className="relative mt-4 flex items-center justify-between rounded-2xl border border-forest-700 px-4 py-3 text-sm text-cream-200 transition-colors hover:border-sage-400 hover:text-cream-50"
      >
        Ver sitio público <span aria-hidden="true">↗</span>
      </Link>
    </div>
  )
}

/**
 * Layout raíz del panel /admin: menú lateral (cajón en móvil), barra
 * superior con la fecha y la cuenta, y el contenido.
 *
 * Las pantallas que todavía no se rediseñaron (todo menos Hoy) siguen
 * escritas en tonos oscuros: se muestran dentro de una tarjeta oscura
 * para seguir siendo legibles sobre el fondo claro. Cada una pierde
 * ese envoltorio cuando se rediseña (ver PANTALLAS_RENOVADAS).
 */
const PANTALLAS_RENOVADAS = ['/admin', '/admin/pacientes', '/admin/finanzas']

export function AdminLayout() {
  const [abierto, setAbierto] = useState(false)
  const { pathname } = useLocation()
  const renovada = PANTALLAS_RENOVADAS.includes(pathname)

  useEffect(() => {
    if (!abierto) return
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false)
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [abierto])

  const fecha = new Date().toLocaleDateString('es-BO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="flex min-h-screen bg-cream-100 text-sage-900">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 lg:block">
        <Menu />
      </aside>

      {abierto && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
            className="absolute inset-0 bg-forest-900/60"
          />
          <div className="relative h-full w-72 max-w-[85%]">
            <Menu onNavegar={() => setAbierto(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-cream-300/60 bg-cream-100/90 px-4 py-3 backdrop-blur-sm md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAbierto(true)}
              aria-label="Abrir menú"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-300 bg-cream-50 text-sage-800 lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <p className="text-sm text-sage-700 first-letter:uppercase">{fecha}</p>
          </div>
          <UserButton />
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-8">
          {renovada ? (
            <Outlet />
          ) : (
            <div className="min-h-[calc(100vh-9rem)] overflow-hidden rounded-3xl bg-forest-900 text-cream-50 shadow-sm">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
