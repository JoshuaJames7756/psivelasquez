import { createClerkClient } from '@clerk/backend'
import type { VercelRequest } from '@vercel/node'

/**
 * Requiere CLERK_SECRET_KEY y CLERK_PUBLISHABLE_KEY como variables de
 * entorno (Vercel Project Settings → Environment Variables). No hay
 * fallback: si faltan, la función revienta al arrancar — preferible
 * a arrancar "silenciosamente inseguro".
 */
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY no está configurada.')
}
if (!process.env.CLERK_PUBLISHABLE_KEY) {
  throw new Error('CLERK_PUBLISHABLE_KEY no está configurada.')
}

/**
 * Lista de usuarios autorizados a entrar al panel (IDs de Clerk, separados
 * por coma). Sin esta lista CUALQUIER persona que se registre en Clerk
 * tendría acceso a los datos de los pacientes, así que si falta, el panel
 * queda cerrado (falla cerrada) en vez de abierto.
 */
const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)

if (ADMIN_USER_IDS.length === 0) {
  console.error(
    '[auth] ADMIN_USER_IDS no está configurada: el panel rechazará a todos. ' +
      'Define los IDs de Clerk de Rebeca y de soporte en las variables de entorno.',
  )
}

// Orígenes permitidos para el token de sesión (recomendado por Clerk). Opcional.
const AUTHORIZED_PARTIES = (process.env.AUTHORIZED_PARTIES ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
})

/**
 * Verifica la sesión de Clerk en el request. Usa authenticateRequest(),
 * el método soportado y recomendado por Clerk (verifySession() está
 * deprecated). Convierte VercelRequest a un Request estándar porque
 * authenticateRequest() espera la Web API Request, no el objeto de
 * Node/Express que expone Vercel.
 *
 * Rol único (Rebeca + soporte), pero se verifica contra ADMIN_USER_IDS:
 * no se asume que Clerk solo tenga usuarios invitados.
 */
export async function verificarSesion(req: VercelRequest): Promise<{ userId: string } | null> {
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value)
    else if (Array.isArray(value)) headers.set(key, value.join(', '))
  }

  // authenticateRequest() necesita una URL absoluta para construir el
  // Request; el host real viene en los headers que reenvía Vercel.
  const host = req.headers.host ?? 'localhost'
  const protocolo = req.headers['x-forwarded-proto'] ?? 'https'
  const url = `${protocolo}://${host}${req.url ?? ''}`

  const request = new Request(url, { headers })

  const estado = await clerkClient.authenticateRequest(
    request,
    AUTHORIZED_PARTIES.length ? { authorizedParties: AUTHORIZED_PARTIES } : undefined,
  )

  if (!estado.isAuthenticated) {
    return null
  }

  const auth = estado.toAuth()
  if (!auth?.userId) {
    return null
  }

  // Sesión válida NO basta: el usuario debe estar en la lista de autorizados.
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return null
  }

  return { userId: auth.userId }
}
