import { useEffect, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'

export interface PacienteEnRiesgo {
  id: string
  nombre: string
  telefono: string | null
  ultima_cita_confirmada: string
}

export function usePacientesEnRiesgo() {
  const apiClient = useApiClient()
  const [pacientes, setPacientes] = useState<PacienteEnRiesgo[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    apiClient
      .get<{ pacientes: PacienteEnRiesgo[] }>('/pacientes?en_riesgo=1')
      .then((data) => setPacientes(data.pacientes))
      .catch(() => setPacientes([]))
      .finally(() => setCargando(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { pacientes, cargando }
}
