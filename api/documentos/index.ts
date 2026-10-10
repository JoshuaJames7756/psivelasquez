import type { VercelRequest, VercelResponse } from '@vercel/node'
import { registrarAuditoria } from '../../server-lib/auditoria.js'
import { verificarSesion } from '../../server-lib/auth.js'
import { cloudinary } from '../../server-lib/cloudinary.js'
import { sql } from '../../server-lib/db.js'

/**
 * GET /api/documentos?id=  → { url } (firmada y de corta vida si es privado)
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
 * Documentos nuevos: privados (Cloudinary type 'authenticated'), se
 * abren solo con GET (enlace firmado, 5 min) y DELETE también borra el
 * archivo en Cloudinary. Documentos anteriores (privado = false) siguen
 * con su enlace público hasta que se eliminen y se vuelvan a adjuntar.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sesion = await verificarSesion(req)
  if (!sesion) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  if (req.method === 'GET') {
    const id = req.query.id
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'id requerido' })
    }
    try {
      const [doc] = await sql`
        select id, paciente_id, nombre, url, public_id, resource_type, formato, privado
        from documentos_paciente where id = ${id}
      `
      if (!doc) return res.status(404).json({ error: 'Documento no encontrado' })

      registrarAuditoria({
        usuarioId: sesion.userId,
        tipoEvento: 'acceso_paciente',
        pacienteId: doc.paciente_id,
        detalle: 'abrió un documento adjunto',
      })

      if (!doc.privado) {
        // Documento anterior a la migración 011: enlace público.
        return res.status(200).json({ url: doc.url })
      }

      // Enlace firmado que vence en 5 minutos.
      const url = cloudinary.utils.private_download_url(doc.public_id, (doc.formato || undefined) as string, {
        resource_type: doc.resource_type,
        type: 'authenticated',
        expires_at: Math.floor(Date.now() / 1000) + 300,
      })
      return res.status(200).json({ url })
    } catch (err) {
      console.error('[GET /api/documentos]', err)
      return res.status(500).json({ error: 'No se pudo abrir el documento' })
    }
  }

  if (req.method === 'POST') {
    const { pacienteId, url, nombre, tipo, publicId, resourceType, formato, privado } = req.body ?? {}
    const esPrivado = privado === true
    if (esPrivado) {
      // Zero-Trust: el public_id debe estar bajo la carpeta de ESTE paciente.
      const okPublicId =
        typeof publicId === 'string' &&
        typeof pacienteId === 'string' &&
        publicId.startsWith(`rebeca-velasquez/pacientes/${pacienteId}/`)
      const okTipo = resourceType === 'image' || resourceType === 'raw'
      if (!okPublicId || !okTipo) {
        return res.status(400).json({ error: 'Datos de documento inválidos' })
      }
    }
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
        insert into documentos_paciente
          (paciente_id, url, nombre, tipo, public_id, resource_type, formato, privado)
        values (
          ${pacienteId}, ${url}, ${nombre}, ${typeof tipo === 'string' ? tipo : null},
          ${esPrivado ? publicId : null}, ${esPrivado ? resourceType : null},
          ${esPrivado && typeof formato === 'string' ? formato : null}, ${esPrivado}
        )
        returning id, paciente_id, case when privado then null else url end as url,
                  nombre, tipo, subido_en, privado
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
        returning id, paciente_id, nombre, public_id, resource_type, privado
      `
      if (!eliminado) {
        return res.status(404).json({ error: 'Documento no encontrado' })
      }

      // Documentos privados: además se borra el archivo real de Cloudinary.
      // Si falla, la fila ya no existe; se registra y no se tumba la acción.
      if (eliminado.privado && eliminado.public_id) {
        try {
          await cloudinary.uploader.destroy(eliminado.public_id, {
            type: 'authenticated',
            resource_type: eliminado.resource_type,
            invalidate: true,
          })
        } catch (err) {
          console.error('[DELETE /api/documentos] No se pudo borrar en Cloudinary', err)
        }
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

  res.setHeader('Allow', 'GET, POST, DELETE')
  return res.status(405).json({ error: 'Método no permitido' })
}
