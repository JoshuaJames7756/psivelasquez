import { useEffect, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'

interface ResumenMes {
  sesionesDadas: number
  pacientesActivos: number
  precioConfigurado: boolean
  ingresoEstimado: number | null
}

export function useResumenMes() {
  const apiClient = useApiClient()
  const [resumen, setResumen] = useState<ResumenMes | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    apiClient
      .get<ResumenMes>('/resumen-mes')
      .then(setResumen)
      .catch(() => setResumen(null))
      .finally(() => setCargando(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { resumen, cargando }
}
