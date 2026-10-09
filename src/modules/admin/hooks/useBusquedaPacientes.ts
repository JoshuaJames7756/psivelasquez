import { useEffect, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'
import type { Paciente } from '../../shared/types/db'

const DEBOUNCE_MS = 300

export function useBusquedaPacientes(termino: string, version = 0) {
  const apiClient = useApiClient()
  const [resultados, setResultados] = useState<Paciente[]>([])
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setCargando(true)
    const timeout = setTimeout(() => {
      const query = termino.trim() ? `?q=${encodeURIComponent(termino.trim())}` : ''
      apiClient
        .get<{ pacientes: Paciente[] }>(`/pacientes${query}`)
        .then((data) => setResultados(data.pacientes))
        .catch(() => setResultados([]))
        .finally(() => setCargando(false))
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termino, version])

  return { resultados, cargando }
}
