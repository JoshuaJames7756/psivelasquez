import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../_lib/db.js'

const HORAS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

function proximoSabado(): string {
  const hoy = new Date()
  const diasHastaSabado = (6 - hoy.getUTCDay() + 7) % 7 || 7
  const fecha = new Date(hoy)
  fecha.setUTCDate(hoy.getUTCDate() + diasHastaSabado)
  return fecha.toISOString().slice(0, 10)
}

/**
 * GET /api/cron/generar-slots
 * Llamada por Vercel Cron (ver vercel.json) — genera los 8 slots del
 * próximo sábado si todavía no existen. Idempotente: cada INSERT usa
 * ON CONFLICT DO NOTHING sobre uq_slot_fecha_hora, así que correr
 * esto todos los días no duplica nada ni pisa una reserva en curso.
 *
 * Un INSERT por hora (no unnest de un array JS) porque no hay
 * confirmación de que @neondatabase/serverless serialice un array
 * de JS como text[] de forma segura para unnest — todos los INSERT
 * van en una sola transacción vía sql.transaction(), que sí está
 * confirmado que funciona (mismo patrón que api/citas/reagendar.ts).
 *
 * Protegido por CRON_SECRET, que Vercel provisiona automáticamente
 * y manda en el header Authorization al invocar el cron.
 *
 * Los cron jobs de Vercel SOLO corren en producción, nunca en
 * desarrollo local ni en preview deployments. Para generar los
 * slots manualmente mientras tanto (o para probar este endpoint),
 * visitá /api/cron/generar-slots directamente en el navegador o con
 * curl — sin CRON_SECRET configurado en tu .env.local, no pide auth.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secretEsperado = process.env.CRON_SECRET
  if (secretEsperado) {
    const auth = req.headers.authorization
    if (auth !== `Bearer ${secretEsperado}`) {
      return res.status(401).json({ error: 'No autorizado' })
    }
  }

  const fecha = proximoSabado()

  try {
    const resultados = await sql.transaction(
      HORAS.map(
        (hora) => sql`
          insert into slots_sabado (fecha, hora_inicio)
          values (${fecha}::date, ${hora}::time)
          on conflict (fecha, hora_inicio) do nothing
          returning id
        `,
      ),
    )

    const slotsCreados = resultados.reduce((total, filas) => total + filas.length, 0)

    return res.status(200).json({ fecha, slotsCreados })
  } catch (err) {
    console.error('[GET /api/cron/generar-slots]', err)
    return res.status(500).json({ error: 'Error al generar los slots' })
  }
}
