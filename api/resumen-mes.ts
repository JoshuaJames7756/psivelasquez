import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../server-lib/auth.js'
import { sql } from '../server-lib/db.js'

/**
 * GET /api/resumen-mes
 * Solo panel. Números simples del mes en curso: sesiones confirmadas,
 * ingreso estimado, pacientes activos.
 *
 * El precio de sesión no se publica en el sitio (se coordina por
 * WhatsApp), así que vive en la tabla `configuracion`, editable por
 * Rebeca desde el panel. Si no lo configuró aún (precio = 0),
 * `precioConfigurado: false` para que el frontend lo muestre como
 * "configura tu precio" en vez de un ingreso estimado falso de 0.
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
    const [{ sesiones_dadas }] = await sql`
      select count(*)::int as sesiones_dadas
      from slots_sabado
      where estado = 'confirmada'
        and date_trunc('month', fecha) = date_trunc('month', current_date)
    `

    const [{ pacientes_activos }] = await sql`
      select count(*)::int as pacientes_activos
      from pacientes
      where estado = 'activo'
    `

    const [configPrecio] = await sql`
      select valor from configuracion where clave = 'precio_sesion_bob'
    `
    const precioSesion = Number(configPrecio?.valor ?? 0)
    const precioConfigurado = precioSesion > 0

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
