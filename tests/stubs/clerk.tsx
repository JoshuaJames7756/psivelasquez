import type { ReactNode } from 'react'

/**
 * Reemplazo de @clerk/clerk-react SOLO para las pruebas de navegador del
 * panel (se activa con E2E_CLERK_STUB=1, ver vite.config.ts). Simula una
 * sesión iniciada para poder recorrer /admin sin cuenta real ni red.
 * No se incluye jamás en el build de producción.
 */
const getToken = async () => 'token-de-prueba'
export const ClerkProvider = ({ children }: { children: ReactNode }) => <>{children}</>
export const useAuth = () => ({ getToken, isSignedIn: true, isLoaded: true })
export const useUser = () => ({ user: { firstName: 'Rebeca' } })
export const UserButton = () => <button type="button" aria-label="Cuenta de prueba">R</button>
export const SignIn = () => <p>Inicio de sesión (prueba)</p>
export const SignedIn = ({ children }: { children: ReactNode }) => <>{children}</>
export const SignedOut = () => null
export const ClerkLoading = () => null
export const ClerkLoaded = ({ children }: { children: ReactNode }) => <>{children}</>
export const RedirectToSignIn = () => null
