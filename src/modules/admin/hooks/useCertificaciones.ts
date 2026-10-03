import { useCallback, useEffect, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'
import type { Certificacion } from '../../shared/types/db'

interface RespuestaFirma {
  timestamp: number
  folder: string
  signature: string
  apiKey: string
  cloudName: string
}

interface DatosNuevaCertificacion {
  institucion: string
  nombre: string
  anio?: number
  categoria?: string
  descripcion?: string
  archivo?: File
}

export function useCertificaciones() {
  const apiClient = useApiClient()
  const [certificaciones, setCertificaciones] = useState<Certificacion[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    setCargando(true)
    try {
      const data = await apiClient.get<{ certificaciones: Certificacion[] }>('/certificaciones')
      setCertificaciones(data.certificaciones)
    } catch {
      setCertificaciones([])
    } finally {
      setCargando(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  async function crear(datos: DatosNuevaCertificacion) {
    setGuardando(true)
    setError(null)
    try {
      let documentoUrl: string | undefined

      // Subida directa a Cloudinary (mismo patrón que useSubirDocumento),
      // si se adjuntó un archivo — es opcional, una certificación
      // puede registrarse primero y adjuntar el PDF después.
      if (datos.archivo) {
        const firma = await apiClient.post<RespuestaFirma>('/documentos/firma', {
          contexto: 'certificacion',
        })

        const formData = new FormData()
        formData.append('file', datos.archivo)
        formData.append('api_key', firma.apiKey)
        formData.append('timestamp', String(firma.timestamp))
        formData.append('signature', firma.signature)
        formData.append('folder', firma.folder)

        const resCloudinary = await fetch(
          `https://api.cloudinary.com/v1_1/${firma.cloudName}/auto/upload`,
          { method: 'POST', body: formData },
        )
        if (!resCloudinary.ok) throw new Error('No se pudo subir el archivo')
        const dataCloudinary = await resCloudinary.json()
        documentoUrl = dataCloudinary.secure_url
      }

      await apiClient.post('/certificaciones', {
        institucion: datos.institucion,
        nombre: datos.nombre,
        anio: datos.anio,
        categoria: datos.categoria,
        descripcion: datos.descripcion,
        documentoUrl,
      })

      await recargar()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la certificación')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(id: string) {
    await apiClient.delete('/certificaciones', { id })
    await recargar()
  }

  return { certificaciones, cargando, guardando, error, crear, eliminar }
}
