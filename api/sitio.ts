import type { VercelRequest, VercelResponse } from '@vercel/node'
import { manejarCertificaciones } from '../server-lib/certificaciones.js'
import { manejarRedes } from '../server-lib/redes.js'

/**
 * Contenido administrable del sitio público, en UNA sola función
 * serverless (límite de 12 en Vercel Hobby, ver README).
 *
 *   /api/sitio?recurso=certificaciones
 *   /api/sitio?recurso=redes
 *
 * Para sumar otro recurso editable (ej. testimonios) se agrega un
 * manejador en /server-lib y una línea acá, sin crear otro archivo.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const recurso = req.query.recurso
  if (recurso === 'certificaciones') return manejarCertificaciones(req, res)
  if (recurso === 'redes') return manejarRedes(req, res)
  return res.status(400).json({ error: 'recurso desconocido' })
}
