import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../_lib/auth.js'
import { sql } from '../_lib/db.js'

/**
 * POST /api/documentos   body: { pacienteId, url, nombre, tipo }
 * Solo panel. Se llama DESPUÉS de que el navegador subió el archivo
 * directo a Cloudinary (ver /api/documentos/firma) — esta función
 * solo registra la referencia en nuestra DB, nunca recibe el archivo
 * en sí.
 *
 * No hay verificación de que la URL realmente venga de Cloudinary
 * (sería razonable agregarla si se vuelve un problema real), pero el
 * riesgo es bajo: solo Rebeca/Joshua llegan hasta acá (endpoint
 * protegido), y en el peor caso guardarían un link roto en su propia
 * ficha de paciente, no un vector de ataque hacia terceros.
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

  const { pacienteId, url, nombre, tipo } = req.body ?? {}
  if (
    typeof pacienteId !== 'string' ||
    typeof url !== 'string' ||
    typeof nombre !== 'string' ||
    !url.startsWith('https://')
  ) {
    return res.status(400).json({ error: 'Datos de documento inválidos' })
  }

  try {
    const [documento] = await sql`
      insert into documentos_paciente (paciente_id, url, nombre, tipo)
      values (${pacienteId}, ${url}, ${nombre}, ${typeof tipo === 'string' ? tipo : null})
      returning id, url, nombre, tipo, subido_en
    `

    return res.status(201).json({ documento })
  } catch (err) {
    console.error('[POST /api/documentos]', err)
    return res.status(500).json({ error: 'Error al registrar el documento' })
  }
}
