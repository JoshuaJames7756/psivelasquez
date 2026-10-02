import { useEffect, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'

interface SlotPendiente {
  id: string
  fecha: string
  hora_inicio: string
  paciente_nombre: string
  paciente_telefono: string | null
}

interface PacienteEnRiesgo {
  id: string
  nombre: string
  telefono: string | null
  ultima_cita_confirmada: string
}

interface Seguimiento {
  solicitadas: SlotPendiente[]
  confirmadasSinPago: SlotPendiente[]
  pacientesEnRiesgo: PacienteEnRiesgo[]
}

export function useSeguimiento() {
  const apiClient = useApiClient()
  const [datos, setDatos] = useState<Seguimiento | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    apiClient
      .get<Seguimiento>('/seguimiento')
      .then(setDatos)
      .catch(() => setDatos(null))
      .finally(() => setCargando(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { datos, cargando }
}
