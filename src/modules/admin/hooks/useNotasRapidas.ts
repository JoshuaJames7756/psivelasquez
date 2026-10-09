import { useCallback, useEffect, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'

export interface NotaRapida {
  id: string
  texto: string
  paciente_id: string | null
  paciente_nombre: string | null
  creado_en: string
}

const RECURSO = '/tareas?recurso=notas'

export function useNotasRapidas() {
  const apiClient = useApiClient()
  const [notas, setNotas] = useState<NotaRapida[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    try {
      const data = await apiClient.get<{ notas: NotaRapida[] }>(RECURSO)
      setNotas(data.notas)
    } catch {
      setNotas([])
    } finally {
      setCargando(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  async function agregar(texto: string): Promise<boolean> {
    setError(null)
    try {
      await apiClient.post(RECURSO, { texto })
      await recargar()
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar la nota')
      return false
    }
  }

  async function eliminar(id: string) {
    await apiClient.delete(RECURSO, { id })
    await recargar()
  }

  return { notas, cargando, error, agregar, eliminar }
}
