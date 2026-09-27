import { useEffect, useRef, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'

const DEBOUNCE_MS = 800

export type EstadoAutoguardado = 'inactivo' | 'guardando' | 'guardado' | 'error'

interface CamposHistorial {
  motivo: string
  intervencion: string
  tareasHomework: string
  proximosPasos: string
}

/**
 * Autoguardado progresivo del historial clínico — sin botón manual.
 * Contrato con el backend (ver api/historial/[id].ts): siempre se
 * manda el objeto COMPLETO de campos, nunca un diff parcial, para
 * que un campo vaciado se persista de verdad.
 */
export function useAutoguardadoHistorial(historialId: string | null, campos: CamposHistorial) {
  const apiClient = useApiClient()
  const [estado, setEstado] = useState<EstadoAutoguardado>('inactivo')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Evita el guardado disparado por la carga inicial de datos del
  // servidor. Se resetea cuando cambia historialId (nuevo paciente),
  // no solo en el montaje del hook.
  const idPrevioRef = useRef<string | null>(null)
  const esCargaInicialRef = useRef(true)

  if (historialId !== idPrevioRef.current) {
    idPrevioRef.current = historialId
    esCargaInicialRef.current = true
  }

  useEffect(() => {
    if (!historialId) return

    if (esCargaInicialRef.current) {
      esCargaInicialRef.current = false
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(async () => {
      setEstado('guardando')
      try {
        await apiClient.put(`/historial/${historialId}`, campos)
        setEstado('guardado')
      } catch {
        setEstado('error')
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    historialId,
    campos.motivo,
    campos.intervencion,
    campos.tareasHomework,
    campos.proximosPasos,
    apiClient,
  ])

  // Vuelve a "inactivo" el indicador de éxito tras un momento, para
  // que no quede un check verde fijo en pantalla indefinidamente.
  useEffect(() => {
    if (estado !== 'guardado') return
    const t = setTimeout(() => setEstado('inactivo'), 2000)
    return () => clearTimeout(t)
  }, [estado])

  return { estado }
}
