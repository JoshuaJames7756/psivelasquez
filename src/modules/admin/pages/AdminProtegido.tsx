import { Suspense } from 'react'
import { PantallaCarga } from '../../shared/components/PantallaCarga'
import { RequireAuth } from '../components/RequireAuth'
import { AdminLayout } from './AdminLayout'

/** Rutas /admin: exige sesión de Clerk y luego muestra el panel. */
export function AdminProtegido() {
  return (
    <RequireAuth>
      <Suspense fallback={<PantallaCarga />}>
        <AdminLayout />
      </Suspense>
    </RequireAuth>
  )
}
