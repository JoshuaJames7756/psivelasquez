import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import rebecaAvatar from '../../../assets/fotos/rebeca-avatar.jpg'

const links = [
  { to: '/sobre-mi', label: 'Sobre mí' },
  { to: '/como-trabajo', label: 'Cómo trabajo' },
  { to: '/enfoques', label: 'Enfoques' },
  { to: '/formacion', label: 'Formación' },
  { to: '/modalidad', label: 'Modalidad' },
  { to: '/faq', label: 'FAQ' },
]

export function NavPublica() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/60 bg-cream-50/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src={rebecaAvatar}
            alt="Rebeca Velásquez"
            className="h-9 w-9 rounded-full object-cover"
            width={300}
            height={300}
          />
          <span className="font-[var(--font-serif-brand)] text-xl text-sage-900">RV</span>
        </NavLink>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-sage-900' : 'text-sage-600 hover:text-sage-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/reservar"
            className="rounded-full bg-sage-700 px-5 py-2 text-sm font-medium text-cream-50 transition-colors hover:bg-sage-800"
          >
            Reservar
          </NavLink>
        </nav>

        {/* Botón menú mobile */}
        <button
          onClick={() => setMenuAbierto((v) => !v)}
          className="text-sage-800 md:hidden"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            {menuAbierto ? (
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Nav mobile */}
      {menuAbierto && (
        <nav className="flex flex-col gap-1 border-t border-sage-200/60 px-6 py-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-sage-100 text-sage-900' : 'text-sage-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/reservar"
            onClick={() => setMenuAbierto(false)}
            className="mt-2 rounded-full bg-sage-700 px-5 py-2.5 text-center text-sm font-medium text-cream-50"
          >
            Reservar
          </NavLink>
        </nav>
      )}
    </header>
  )
}
