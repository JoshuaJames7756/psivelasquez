import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../server-lib/auth.js'
import { sql } from '../server-lib/db.js'

/**
 * GET /api/resumen-mes               — números simples para Hoy
 * GET /api/resumen-mes?finanzas=1    — vista ampliada (sección 32 del doc)
 *
 * Solo panel. Fusiona la vista de Finanzas acá en vez de crear un
 * archivo nuevo — límite de 12 funciones serverless en Vercel Hobby,
 * hoy sin margen (ver README).
 *
 * El precio de sesión no se publica en el sitio (se coordina por
 * WhatsApp), así que vive en la tabla `configuracion`, editable por
 * Rebeca desde el panel.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const sesion = await verificarSesion(req)
  if (!sesion) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  try {
    const [configPrecio] = await sql`
      select valor from configuracion where clave = 'precio_sesion_bob'
    `
    const precioSesion = Number(configPrecio?.valor ?? 0)
    const precioConfigurado = precioSesion > 0

    if (req.query.finanzas === '1') {
      const [{ sesiones_pagadas }] = await sql`
        select count(*)::int as sesiones_pagadas
        from slots_sabado
        where estado in ('pagada', 'completada')
          and date_trunc('month', fecha) = date_trunc('month', current_date)
      `

      const [{ pagos_pendientes }] = await sql`
        select count(*)::int as pagos_pendientes
        from slots_sabado
        where estado = 'confirmada'
      `

      // "Depósito" en nuestro flujo es siempre el 50% del precio de
      // sesión (sección 19 del doc) — no hay un monto distinto
      // guardado por reserva, se calcula sobre el precio configurado.
      const ingresoConfirmado = precioConfigurado ? sesiones_pagadas * precioSesion : null
      const pendienteDeCobro = precioConfigurado ? pagos_pendientes * precioSesion * 0.5 : null

      return res.status(200).json({
        precioConfigurado,
        precioSesion: precioConfigurado ? precioSesion : null,
        sesionesPagadas: sesiones_pagadas,
        ingresoConfirmado,
        pagosPendientes: pagos_pendientes,
        pendienteDeCobro,
      })
    }

    const [{ sesiones_dadas }] = await sql`
      select count(*)::int as sesiones_dadas
      from slots_sabado
      where estado in ('pagada', 'completada')
        and date_trunc('month', fecha) = date_trunc('month', current_date)
    `

    const [{ pacientes_activos }] = await sql`
      select count(*)::int as pacientes_activos
      from pacientes
      where estado = 'activo'
    `

    return res.status(200).json({
      sesionesDadas: sesiones_dadas,
      pacientesActivos: pacientes_activos,
      precioConfigurado,
      ingresoEstimado: precioConfigurado ? sesiones_dadas * precioSesion : null,
    })
  } catch (err) {
    console.error('[GET /api/resumen-mes]', err)
    return res.status(500).json({ error: 'Error al calcular el resumen del mes' })
  }
}
