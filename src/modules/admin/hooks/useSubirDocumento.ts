import { useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'
import type { DocumentoPaciente } from '../../shared/types/db'

interface RespuestaFirma {
  timestamp: number
  folder: string
  signature: string
  apiKey: string
  cloudName: string
}

/**
 * Sube un archivo directo al bucket de Cloudinary del navegador (no
 * pasa por nuestro backend, evita el límite de tamaño de las
 * funciones serverless de Vercel), usando la firma que genera
 * /api/documentos/firma. Al terminar, registra la referencia en
 * nuestra DB vía /api/documentos.
 */
export function useSubirDocumento(pacienteId: string, onSubido: (doc: DocumentoPaciente) => void) {
  const apiClient = useApiClient()
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function subir(archivo: File) {
    setSubiendo(true)
    setError(null)

    try {
      const firma = await apiClient.post<RespuestaFirma>('/documentos/firma', { pacienteId })

      const formData = new FormData()
      formData.append('file', archivo)
      formData.append('api_key', firma.apiKey)
      formData.append('timestamp', String(firma.timestamp))
      formData.append('signature', firma.signature)
      formData.append('folder', firma.folder)

      const resCloudinary = await fetch(
        `https://api.cloudinary.com/v1_1/${firma.cloudName}/auto/upload`,
        { method: 'POST', body: formData },
      )

      if (!resCloudinary.ok) {
        throw new Error('No se pudo subir el archivo')
      }

      const dataCloudinary = await resCloudinary.json()

      const { documento } = await apiClient.post<{ documento: DocumentoPaciente }>('/documentos', {
        pacienteId,
        url: dataCloudinary.secure_url,
        nombre: archivo.name,
        tipo: archivo.type,
      })

      onSubido(documento)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el documento')
    } finally {
      setSubiendo(false)
    }
  }

  return { subir, subiendo, error }
}
