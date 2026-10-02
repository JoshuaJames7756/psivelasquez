import { useEffect, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'

interface Finanzas {
  precioConfigurado: boolean
  precioSesion: number | null
  sesionesPagadas: number
  ingresoConfirmado: number | null
  pagosPendientes: number
  pendienteDeCobro: number | null
}

export function useFinanzas() {
  const apiClient = useApiClient()
  const [finanzas, setFinanzas] = useState<Finanzas | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    apiClient
      .get<Finanzas>('/resumen-mes?finanzas=1')
      .then(setFinanzas)
      .catch(() => setFinanzas(null))
      .finally(() => setCargando(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { finanzas, cargando }
}
