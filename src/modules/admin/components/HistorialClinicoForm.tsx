import { useState } from 'react'
import { useAutoguardadoHistorial } from '../hooks/useAutoguardadoHistorial'
import { IndicadorAutoguardado } from './IndicadorAutoguardado'
import type { HistorialClinico } from '../../shared/types/db'

/**
 * Nota más reciente del historial, editable con autoguardado.
 * "Próximos pasos" va primero y destacado — es lo que el doc pide
 * explícitamente que no quede enterrado al abrir la ficha.
 *
 * Nota de diseño: este panel usa fondo claro (sage/terracotta claros)
 * a propósito, distinto del resto del admin (forest oscuro) — es
 * el área de lectura/escritura de texto largo en vivo durante sesión,
 * y el contraste claro es más legible sostenido que texto claro
 * sobre fondo oscuro. Revisar con Rebeca si prefiere consistencia
 * visual total en vez de esta excepción funcional.
 */
export function HistorialClinicoForm({ registro }: { registro: HistorialClinico }) {
  const [motivo, setMotivo] = useState(registro.motivo ?? '')
  const [intervencion, setIntervencion] = useState(registro.intervencion ?? '')
  const [tareasHomework, setTareasHomework] = useState(registro.tareas_homework ?? '')
  const [proximosPasos, setProximosPasos] = useState(registro.proximos_pasos ?? '')

  const { estado } = useAutoguardadoHistorial(registro.id, {
    motivo,
    intervencion,
    tareasHomework,
    proximosPasos,
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-sage-800">Sesión más reciente</h3>
        <IndicadorAutoguardado estado={estado} />
      </div>

      {/* Próximos pasos — destacado, primero, nunca enterrado */}
      <div className="rounded-xl border-2 border-terracotta-300 bg-terracotta-50 p-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-terracotta-600">
          Próximos pasos
        </label>
        <textarea
          value={proximosPasos}
          onChange={(e) => setProximosPasos(e.target.value)}
          rows={2}
          className="mt-2 w-full resize-none bg-transparent text-sm text-sage-900 placeholder:text-sage-400 focus:outline-none"
          placeholder="¿Qué sigue en el proceso de este paciente?"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-sage-600">Motivo</label>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-sage-200 p-3 text-sm text-sage-900 focus:border-sage-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-sage-600">Intervención</label>
        <textarea
          value={intervencion}
          onChange={(e) => setIntervencion(e.target.value)}
          rows={3}
          className="mt-1 w-full resize-none rounded-lg border border-sage-200 p-3 text-sm text-sage-900 focus:border-sage-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-sage-600">Tareas / homework</label>
        <textarea
          value={tareasHomework}
          onChange={(e) => setTareasHomework(e.target.value)}
          rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-sage-200 p-3 text-sm text-sage-900 focus:border-sage-500 focus:outline-none"
        />
      </div>
    </div>
  )
}
