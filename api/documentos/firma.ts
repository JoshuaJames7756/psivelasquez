import { v2 as cloudinary } from 'cloudinary'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../../server-lib/auth.js'

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('CLOUDINARY_CLOUD_NAME no está configurada.')
}
if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error('CLOUDINARY_API_KEY no está configurada.')
}
if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error('CLOUDINARY_API_SECRET no está configurada.')
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
  if (contexto === 'certificacion') {
    folder = 'rebeca-velasquez/certificaciones'
  } else if (contexto === 'redes') {
    folder = 'rebeca-velasquez/redes'
  } else if (typeof pacienteId === 'string') {
    folder = `rebeca-velasquez/pacientes/${pacienteId}`
  } else {
    return res.status(400).json({ error: 'pacienteId o contexto requerido' })
  }

  const timestamp = Math.round(Date.now() / 1000)

  const firma = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!,
  )

  return res.status(200).json({
    timestamp,
    folder,
    signature: firma,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  })
}
