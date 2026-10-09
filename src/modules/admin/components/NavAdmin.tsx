import { NavLink } from 'react-router-dom'

// Iconografía propia por sección (SVG inline), no íconos de librería genérica.
const items = [
  {
    to: '/admin',
    grupo: 'Clínica',
    label: 'Hoy',
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/admin/agenda',
    grupo: 'Clínica',
    label: 'Agenda',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 9.5h16M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/admin/pacientes',
    grupo: 'Clínica',
    label: 'Pacientes',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <circle cx="12" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: '/admin/seguimiento',
    grupo: 'Clínica',
    label: 'Seguimiento',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 4a8 8 0 100 16 8 8 0 000-16z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M12 9v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/admin/tareas',
    grupo: 'Gestión',
    label: 'Tareas',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/admin/finanzas',
    grupo: 'Gestión',
    label: 'Finanzas',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 3v18M7 7h7a3 3 0 010 6H8a3 3 0 000 6h8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: '/admin/credenciales',
    grupo: 'Sitio web',
    label: 'Credenciales',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 3l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: '/admin/contenido',
    grupo: 'Sitio web',
    label: 'Contenido',
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" />
      </svg>
    ),
  },
]

const ordenGrupos = ['Clínica', 'Gestión', 'Sitio web']

export function NavAdmin({ onNavegar }: { onNavegar?: () => void }) {
  return (
    <nav aria-label="Panel" className="space-y-6">
      {ordenGrupos.map((grupo) => (
        <div key={grupo}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sage-300/60">
            {grupo}
          </p>
          <div className="space-y-1">
            {items
              .filter((item) => item.grupo === grupo)
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavegar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sage-200 text-forest-900 shadow-sm'
                        : 'text-cream-200 hover:bg-forest-800 hover:text-cream-50'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
          </div>
        </div>
      ))}
    </nav>
  )
}
