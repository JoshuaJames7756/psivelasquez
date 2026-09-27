import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import type { ReactNode } from 'react'

/**
 * Protege /admin: si hay sesión de Clerk válida, renderiza el panel.
 * Si no, redirige al flujo de sign-in de Clerk (componente propio,
 * ver ClerkProvider en main.tsx).
 *
 * rol único: cualquier cuenta invitada al proyecto de Clerk (Rebeca
 * o Joshua) tiene acceso completo — no hay distinción de permisos
 * adicional a nivel de este componente.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
