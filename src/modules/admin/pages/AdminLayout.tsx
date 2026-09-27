import { Outlet } from 'react-router-dom'
import { NavAdmin } from '../components/NavAdmin'

/**
 * Layout raíz del panel /admin.
 * Placeholder: acá se engancha la verificación de sesión Clerk
 * (rol único: Rebeca + Joshua como cuenta de soporte/producción)
 * antes de renderizar cualquier página hija.
 */
export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-forest-900 text-cream-50">
      <aside className="flex w-64 shrink-0 flex-col border-r border-forest-700 p-4">
        <p className="mb-8 px-2 font-[var(--font-serif-brand)] text-2xl">RV</p>
        <NavAdmin />
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
