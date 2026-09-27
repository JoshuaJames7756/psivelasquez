import { neon } from '@neondatabase/serverless'

/**
 * Punto único de conexión a Neon. Ninguna función /api debe importar
 * @neondatabase/serverless directamente; todas pasan por acá.
 *
 * DATABASE_URL se configura como variable de entorno en Vercel
 * (Project Settings → Environment Variables), nunca hardcodeada.
 */
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL no está configurada. Definila en las variables de entorno de Vercel (o .env.local en desarrollo).',
  )
}

export const sql = neon(process.env.DATABASE_URL)
