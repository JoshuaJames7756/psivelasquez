import type { VercelRequest, VercelResponse } from '@vercel/node'
import { registrarAuditoria } from '../../server-lib/auditoria.js'
import { verificarSesion } from '../../server-lib/auth.js'
import { sql } from '../../server-lib/db.js'

/**
 * POST /api/documentos    body: { pacienteId, url, nombre, tipo }
 * DELETE /api/documentos  body: { id }
 *
 * Solo panel. Fusiona documentos/index.ts + documentos/[id].ts en un
 * solo archivo (límite de 12 funciones serverless en el plan Hobby
 * de Vercel) — un archivo [id].ts separado habría sido una segunda
 * función; en cambio, DELETE toma el id del BODY, no de la URL,
 * porque esta ruta ya no tiene segmento dinámico.
 *
 * POST se llama DESPUÉS de que el navegador subió el archivo directo
 * a Cloudinary (ver /api/documentos/firma) — nunca recibe el archivo
 * en sí, solo registra la referencia.
 *
 * DELETE NO elimina el archivo real en Cloudinary — eso requeriría
 * guardar el public_id (hoy solo guardamos secure_url) y llamar a
 * cloudinary.uploader.destroy(). Pendiente si se necesita borrado
 * real del storage; por ahora el archivo queda huérfano en
 * Cloudinary pero desaparece de la ficha del paciente.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sesion = await verificarSesion(req)
  if (!sesion) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  if (req.method === 'POST') {
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

  if (req.method === 'DELETE') {
    const { id } = req.body ?? {}
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'id requerido' })
    }

    try {
      const [eliminado] = await sql`
        delete from documentos_paciente
        where id = ${id}
        returning id, paciente_id, nombre
      `
      if (!eliminado) {
        return res.status(404).json({ error: 'Documento no encontrado' })
      }

      registrarAuditoria({
        usuarioId: sesion.userId,
        tipoEvento: 'eliminacion_documento',
        pacienteId: eliminado.paciente_id,
        detalle: eliminado.nombre,
      })

      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('[DELETE /api/documentos]', err)
      return res.status(500).json({ error: 'Error al eliminar el documento' })
    }
  }

  res.setHeader('Allow', 'POST, DELETE')
  return res.status(405).json({ error: 'Método no permitido' })
}
