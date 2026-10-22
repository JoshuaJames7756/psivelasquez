import { ClerkProvider } from '@clerk/clerk-react'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { PantallaCarga } from '../shared/components/PantallaCarga'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

/**
 * Único lugar donde se monta Clerk. Solo se descarga al entrar a /admin o
 * /sign-in: quien visita el sitio público no baja el código de Clerk ni hace
 * ninguna petición a sus servidores (mejor velocidad y más privacidad).
 */
export function ClerkRaiz() {
  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error(
      'Falta VITE_CLERK_PUBLISHABLE_KEY. Defínela en .env.local (desarrollo) o en las variables de entorno de Vercel (producción).',
    )
  }
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Suspense fallback={<PantallaCarga />}>
        <Outlet />
      </Suspense>
    </ClerkProvider>
  )
}
