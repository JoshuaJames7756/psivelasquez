import { useCallback, useEffect, useState } from 'react'
import type { EstadoCita, ModalidadCita } from '../../shared/types/db'

/**
 * Forma reducida que devuelve GET /api/citas (público) — sin datos de
 * paciente, solo lo necesario para pintar la grilla del sitio.
 */
export interface SlotPublico {
  id: string
  fecha: string
  hora_inicio: string
  modalidad: ModalidadCita | null
  estado: EstadoCita
}

/**
 * Consumo directo de /api/citas (público, sin auth) — no usa
 * useApiClient() porque esa ruta no requiere ni acepta token de
 * sesión, y este hook vive fuera de /admin.
 */
export function useSlotsPublicos() {
  const [slots, setSlots] = useState<SlotPublico[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch('/api/citas')
      if (!res.ok) throw new Error('No se pudieron cargar los cupos')
      const data = await res.json()
      setSlots(data.slots)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los cupos')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { slots, cargando, error, recargar }
}
