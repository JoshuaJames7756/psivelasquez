import { useCallback, useEffect, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'
import type { SlotSabadoPanel } from '../../shared/types/db'

/**
 * Slots del sábado para uso dentro de /admin — siempre vía
 * /api/citas/panel (protegido, con nombre de paciente incluido).
 * El sitio público usa /api/citas directamente, sin este hook.
 */
export function useSlotsSabado(fecha?: string) {
  const apiClient = useApiClient()
  const [slots, setSlots] = useState<SlotSabadoPanel[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const query = fecha ? `?fecha=${fecha}` : ''
      const data = await apiClient.get<{ slots: SlotSabadoPanel[] }>(`/citas/panel${query}`)
      setSlots(data.slots)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los cupos')
    } finally {
      setCargando(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha, apiClient])

  useEffect(() => {
    recargar()
  }, [recargar])

  async function confirmar(slotId: string) {
    await apiClient.patch(`/citas/${slotId}`, { accion: 'confirmar' })
    await recargar()
  }

  async function liberar(slotId: string) {
    await apiClient.patch(`/citas/${slotId}`, { accion: 'liberar' })
    await recargar()
  }

  async function reagendar(slotOrigenId: string, slotDestinoId: string) {
    await apiClient.patch('/citas/reagendar', { slotOrigenId, slotDestinoId })
    await recargar()
  }

  return { slots, cargando, error, recargar, confirmar, liberar, reagendar }
}
