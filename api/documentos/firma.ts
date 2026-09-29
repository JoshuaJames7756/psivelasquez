import { v2 as cloudinary } from 'cloudinary'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../_lib/auth.js'

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
 * POST /api/documentos/firma   body: { pacienteId }
 * Solo panel. Genera una firma de subida (signed upload) para que el
 * navegador suba el archivo DIRECTO a Cloudinary, sin que pase por
 * nuestro backend — evita el límite de tamaño de las funciones
 * serverless de Vercel y evita exponer CLOUDINARY_API_SECRET, que
 * nunca sale de este archivo.
 *
 * El folder incluye pacienteId para organizar los adjuntos por
 * paciente dentro de Cloudinary y, si algún día se necesita, poder
 * borrar todos los archivos de un paciente de una sola vez.
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

  const { pacienteId } = req.body ?? {}
  if (typeof pacienteId !== 'string') {
    return res.status(400).json({ error: 'pacienteId requerido' })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = `rebeca-velasquez/pacientes/${pacienteId}`

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
