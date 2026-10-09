import { useApiClient } from '../../shared/services/apiClient'
import type { HistorialClinico, Paciente } from '../../shared/types/db'

/** Escrituras sobre un paciente. La lectura vive en useFichaPaciente. */
export function useAccionesPaciente() {
  const apiClient = useApiClient()

  return {
    crearNota: (pacienteId: string) =>
      apiClient.post<{ nota: HistorialClinico }>(`/pacientes/${pacienteId}`, { accion: 'nota' }),

    eliminarNota: (pacienteId: string, historialId: string) =>
      apiClient.delete(`/pacientes/${pacienteId}`, { historialId }),

    editarPaciente: (
      pacienteId: string,
      datos: {
        nombre?: string
        edad?: number | null
        telefono?: string | null
        estado?: Paciente['estado']
        motivoInicial?: string | null
      },
    ) => apiClient.patch<{ paciente: Paciente }>(`/pacientes/${pacienteId}`, datos),

    crearPaciente: (datos: { nombre: string; edad?: number | null; telefono?: string; motivoInicial?: string }) =>
      apiClient.post<{ paciente: Paciente }>('/pacientes', datos),
  }
}
