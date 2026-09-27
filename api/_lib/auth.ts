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
 * rol único: cualquier sesión válida de Clerk en este proyecto
 * corresponde a Rebeca o a Joshua (cuenta de soporte) — no hay
 * verificación de rol adicional más allá de "sesión válida", porque
 * el proyecto de Clerk mismo solo tiene estos dos usuarios invitados.
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

  const estado = await clerkClient.authenticateRequest(request)

  if (!estado.isAuthenticated) {
    return null
  }

  const auth = estado.toAuth()
  if (!auth?.userId) {
    return null
  }

  return { userId: auth.userId }
}
