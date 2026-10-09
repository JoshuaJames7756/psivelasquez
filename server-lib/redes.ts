import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from './auth.js'
import { sql } from './db.js'

/**
 * Publicaciones de redes (recurso "redes" de api/sitio.ts).
 *
 * GET    ?recurso=redes             — público: solo las visibles
 * GET    ?recurso=redes&todas=1     — panel: todas (requiere sesión)
 * POST / PATCH / DELETE             — solo panel
 *
 * Zero-Trust: la URL se valida en el servidor (https + dominio de la
 * red indicada) para que el panel no pueda guardar enlaces a otros
 * sitios que luego el público abriría desde el sitio de Rebeca.
 */
const DOMINIOS: Record<string, string[]> = {
  instagram: ['instagram.com', 'www.instagram.com'],
  tiktok: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com'],
}

function urlValida(plataforma: unknown, url: unknown): url is string {
  if (typeof plataforma !== 'string' || !(plataforma in DOMINIOS)) return false
  if (typeof url !== 'string') return false
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && DOMINIOS[plataforma].includes(u.hostname)
  } catch {
    return false
  }
}

function miniaturaValida(m: unknown): boolean {
  if (m === undefined || m === null || m === '') return true
  if (typeof m !== 'string') return false
  try {
    const u = new URL(m)
    return u.protocol === 'https:' && u.hostname === 'res.cloudinary.com'
  } catch {
    return false
  }
}

export async function manejarRedes(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const todas = req.query.todas === '1'
      if (todas) {
        const sesion = await verificarSesion(req)
        if (!sesion) return res.status(401).json({ error: 'No autenticado' })
      }
      const publicaciones = todas
        ? await sql`select * from publicaciones_redes order by orden asc, creado_en desc`
        : await sql`
            select * from publicaciones_redes
            where visible = true
            order by orden asc, creado_en desc
            limit 12
          `
      return res.status(200).json({ publicaciones })
    } catch (err) {
      console.error('[GET redes]', err)
      return res.status(500).json({ error: 'Error al obtener las publicaciones' })
    }
  }

  const sesion = await verificarSesion(req)
  if (!sesion) return res.status(401).json({ error: 'No autenticado' })

  if (req.method === 'POST') {
    const { plataforma, url, titulo, miniaturaUrl } = req.body ?? {}
    if (!urlValida(plataforma, url)) {
      return res.status(400).json({ error: 'El enlace debe ser https y de la red elegida' })
    }
    if (!miniaturaValida(miniaturaUrl)) {
      return res.status(400).json({ error: 'Miniatura no válida' })
    }
    try {
      const [publicacion] = await sql`
        insert into publicaciones_redes (plataforma, url, titulo, miniatura_url, orden)
        values (
          ${plataforma}, ${url}, ${titulo || null}, ${miniaturaUrl || null},
          coalesce((select min(orden) - 1 from publicaciones_redes), 0)
        )
        returning *
      `
      return res.status(201).json({ publicacion })
    } catch (err) {
      console.error('[POST redes]', err)
      return res.status(500).json({ error: 'Error al crear la publicación' })
    }
  }

  if (req.method === 'PATCH') {
    const { id, visible } = req.body ?? {}
    if (typeof id !== 'string' || typeof visible !== 'boolean') {
      return res.status(400).json({ error: 'id y visible requeridos' })
    }
    try {
      const [publicacion] = await sql`
        update publicaciones_redes set visible = ${visible} where id = ${id} returning *
      `
      if (!publicacion) return res.status(404).json({ error: 'No encontrada' })
      return res.status(200).json({ publicacion })
    } catch (err) {
      console.error('[PATCH redes]', err)
      return res.status(500).json({ error: 'Error al actualizar' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body ?? {}
    if (typeof id !== 'string') return res.status(400).json({ error: 'id requerido' })
    try {
      const [eliminada] = await sql`delete from publicaciones_redes where id = ${id} returning id`
      if (!eliminada) return res.status(404).json({ error: 'No encontrada' })
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('[DELETE redes]', err)
      return res.status(500).json({ error: 'Error al eliminar' })
    }
  }

  res.setHeader('Allow', 'GET, POST, PATCH, DELETE')
  return res.status(405).json({ error: 'Método no permitido' })
}
