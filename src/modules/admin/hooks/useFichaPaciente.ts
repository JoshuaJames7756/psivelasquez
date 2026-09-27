import { useCallback, useEffect, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'
import type {
  DocumentoPaciente,
  EscalaSeguimiento,
  HistorialClinico,
  Paciente,
} from '../../shared/types/db'

interface FichaPaciente {
  paciente: Paciente
  historial: HistorialClinico[]
  escalas: EscalaSeguimiento[]
  documentos: DocumentoPaciente[]
}

export function useFichaPaciente(id: string | null) {
  const apiClient = useApiClient()
  const [ficha, setFicha] = useState<FichaPaciente | null>(null)
  const [cargando, setCargando] = useState(false)

  const recargar = useCallback(() => {
    if (!id) {
      setFicha(null)
      return
    }
    setCargando(true)
    apiClient
      .get<FichaPaciente>(`/pacientes/${id}`)
      .then(setFicha)
      .catch(() => setFicha(null))
      .finally(() => setCargando(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, apiClient])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { ficha, cargando, recargar }
}
