import { useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'
import type { EscalaSeguimiento, TipoEscala } from '../../shared/types/db'

export function useRegistrarEscala(pacienteId: string, onRegistrada: (e: EscalaSeguimiento) => void) {
  const apiClient = useApiClient()
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function registrar(tipo: TipoEscala, puntaje: number) {
    setGuardando(true)
    setError(null)
    try {
      const { escala } = await apiClient.post<{ escala: EscalaSeguimiento }>(
        `/pacientes/${pacienteId}`,
        { tipo, puntaje },
      )
      onRegistrada(escala)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar la escala')
    } finally {
      setGuardando(false)
    }
  }

  return { registrar, guardando, error }
}
