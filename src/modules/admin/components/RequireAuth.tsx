import { ClerkLoaded, ClerkLoading, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import type { ReactNode } from 'react'
import { PantallaCarga } from '../../shared/components/PantallaCarga'

/**
 * Protege /admin: si hay sesión de Clerk válida, renderiza el panel.
 * Si no, redirige al flujo de sign-in de Clerk (componente propio,
 * ver ClerkProvider en ClerkRaiz.tsx).
 *
 * rol único: cualquier cuenta invitada al proyecto de Clerk (Rebeca
 * o Joshua) tiene acceso completo — no hay distinción de permisos
 * adicional a nivel de este componente.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Mientras Clerk arranca no hay forma de saber si hay sesión: pantalla de carga, no pantalla en blanco. */}
      <ClerkLoading>
        <PantallaCarga />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>{children}</SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkLoaded>
    </>
  )
}
