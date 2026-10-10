import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../../server-lib/auth.js'
import { cloudinary } from '../../server-lib/cloudinary.js'

/**
 * POST /api/documentos/firma
 *   body: { pacienteId }                    — adjunto de un paciente
 *   body: { contexto: 'certificacion' }     — PDF/imagen de certificación
 *
 * Solo panel. Genera una firma de subida (signed upload) para que el
 * navegador suba el archivo DIRECTO a Cloudinary, sin que pase por
 * nuestro backend — evita el límite de tamaño de las funciones
 * serverless de Vercel y evita exponer CLOUDINARY_API_SECRET, que
 * nunca sale de este archivo.
 *
 * El folder organiza por tipo: pacientes/<id> o certificaciones/,
 * así cada categoría queda separada dentro de Cloudinary.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const sesion = await verificarSesion(req)
  if (!sesion) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  const { pacienteId, contexto } = req.body ?? {}

  let folder: string
  // Los adjuntos de pacientes (datos clínicos) se suben como
  // 'authenticated': Cloudinary no los sirve sin una URL firmada.
  let type: string | undefined
  if (contexto === 'certificacion') {
    folder = 'rebeca-velasquez/certificaciones'
  } else if (contexto === 'redes') {
    folder = 'rebeca-velasquez/redes'
  } else if (typeof pacienteId === 'string') {
    folder = `rebeca-velasquez/pacientes/${pacienteId}`
    type = 'authenticated'
  } else {
    return res.status(400).json({ error: 'pacienteId o contexto requerido' })
  }

  const timestamp = Math.round(Date.now() / 1000)

  const firma = cloudinary.utils.api_sign_request(
    type ? { timestamp, folder, type } : { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!,
  )

  return res.status(200).json({
    timestamp,
    folder,
    type,
    signature: firma,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  })
}
