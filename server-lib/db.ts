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

/**
 * Vence automáticamente los slots "solicitada" cuya ventana de
 * expiración ya pasó (ver migración 004). Llamar esto ANTES de
 * cualquier lectura o escritura de slots_sabado que el usuario vea,
 * para que el vencimiento sea efectivamente inmediato sin depender
 * de un cron aparte.
 *
 * Costo: un UPDATE en cada request que toque slots_sabado, incluso
 * cuando no hay nada que vencer. Aceptable al volumen actual (8
 * slots/semana). Si el tráfico creciera mucho, esto se movería a un
 * trigger de Postgres o a un cron más frecuente (el plan Hobby de
 * Vercel limita a 1 corrida/día; un plan pago permite más).
 */
export async function vencerSlotsExpirados() {
  await sql`select vencer_slots_expirados()`
}
