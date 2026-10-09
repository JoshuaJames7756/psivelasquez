import { useCallback, useEffect, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'
import type { PublicacionRed } from '../../shared/types/db'

interface RespuestaFirma {
  timestamp: number
  folder: string
  signature: string
  apiKey: string
  cloudName: string
}

interface DatosNuevaPublicacion {
  plataforma: 'instagram' | 'tiktok'
  url: string
  titulo?: string
  miniatura?: File
}

const RECURSO = '/sitio?recurso=redes'

export function useRedes() {
  const apiClient = useApiClient()
  const [publicaciones, setPublicaciones] = useState<PublicacionRed[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    try {
      const data = await apiClient.get<{ publicaciones: PublicacionRed[] }>(`${RECURSO}&todas=1`)
      setPublicaciones(data.publicaciones)
    } catch {
      setPublicaciones([])
    } finally {
      setCargando(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  async function crear(datos: DatosNuevaPublicacion): Promise<boolean> {
    setGuardando(true)
    setError(null)
    try {
      let miniaturaUrl: string | undefined
      if (datos.miniatura) {
        const firma = await apiClient.post<RespuestaFirma>('/documentos/firma', {
          contexto: 'redes',
        })
        const form = new FormData()
        form.append('file', datos.miniatura)
        form.append('api_key', firma.apiKey)
        form.append('timestamp', String(firma.timestamp))
        form.append('signature', firma.signature)
        form.append('folder', firma.folder)
        const res = await fetch(`https://api.cloudinary.com/v1_1/${firma.cloudName}/image/upload`, {
          method: 'POST',
          body: form,
        })
        if (!res.ok) throw new Error('No se pudo subir la miniatura')
        miniaturaUrl = (await res.json()).secure_url
      }
      await apiClient.post(RECURSO, {
        plataforma: datos.plataforma,
        url: datos.url,
        titulo: datos.titulo,
        miniaturaUrl,
      })
      await recargar()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
      return false
    } finally {
      setGuardando(false)
    }
  }

  async function cambiarVisible(id: string, visible: boolean) {
    await apiClient.patch(RECURSO, { id, visible })
    await recargar()
  }

  async function eliminar(id: string) {
    await apiClient.delete(RECURSO, { id })
    await recargar()
  }

  return { publicaciones, cargando, guardando, error, crear, cambiarVisible, eliminar }
}
