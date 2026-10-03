import { useAuth } from '@clerk/clerk-react'
import { useMemo } from 'react'

/**
 * Cliente fetch mínimo para consumir /api. Centraliza el manejo de
 * errores para no repetir try/catch + parseo de JSON en cada hook.
 *
 * El frontend nunca construye queries SQL ni toca Neon directamente:
 * esto es el único punto de contacto con el backend.
 */

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, token: string | null, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`/api${path}`, { ...init, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(body?.error ?? `Error ${res.status}`, res.status)
  }

  return res.json() as Promise<T>
}

/**
 * Hook: construye un cliente API que adjunta el token de sesión de
 * Clerk en cada llamada. Usar esto (no un cliente plano fuera de
 * React) es lo que permite acceder a getToken(), que solo existe
 * como hook — ver api/_lib/auth.ts para la verificación server-side
 * correspondiente.
 *
 * Rutas públicas (ej. GET /api/citas del sitio) no necesitan este
 * hook: mandar el header de todos modos no rompe nada porque esas
 * rutas no llaman a verificarSesion().
 */
export function useApiClient() {
  const { getToken } = useAuth()

  return useMemo(
    () => ({
      get: async <T>(path: string) => request<T>(path, await getToken()),
      post: async <T>(path: string, body: unknown) =>
        request<T>(path, await getToken(), { method: 'POST', body: JSON.stringify(body) }),
      patch: async <T>(path: string, body: unknown) =>
        request<T>(path, await getToken(), { method: 'PATCH', body: JSON.stringify(body) }),
      put: async <T>(path: string, body: unknown) =>
        request<T>(path, await getToken(), { method: 'PUT', body: JSON.stringify(body) }),
      delete: async <T>(path: string, body: unknown) =>
        request<T>(path, await getToken(), { method: 'DELETE', body: JSON.stringify(body) }),
    }),
    [getToken],
  )
}
