import { useCallback, useEffect, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'
import type { EstadoTarea, PrioridadTarea, Tarea } from '../../shared/types/db'

export function useTareas() {
  const apiClient = useApiClient()
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [cargando, setCargando] = useState(true)

  const recargar = useCallback(async () => {
    setCargando(true)
    try {
      const data = await apiClient.get<{ tareas: Tarea[] }>('/tareas')
      setTareas(data.tareas)
    } catch {
      setTareas([])
    } finally {
      setCargando(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  async function crear(datos: {
    titulo: string
    descripcion?: string
    prioridad?: PrioridadTarea
    fechaLimite?: string
    pacienteId?: string
  }) {
    await apiClient.post('/tareas', datos)
    await recargar()
  }

  async function cambiarEstado(id: string, estado: EstadoTarea) {
    await apiClient.patch('/tareas', { id, estado })
    await recargar()
  }

  async function eliminar(id: string) {
    await apiClient.delete('/tareas', { id })
    await recargar()
  }

  return { tareas, cargando, recargar, crear, cambiarEstado, eliminar }
}
