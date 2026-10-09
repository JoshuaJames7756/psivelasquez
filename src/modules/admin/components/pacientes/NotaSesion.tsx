import { useState } from 'react'
import type { HistorialClinico } from '../../../shared/types/db'
import { useAutoguardadoHistorial } from '../../hooks/useAutoguardadoHistorial'
import { IndicadorAutoguardado } from '../IndicadorAutoguardado'

const area =
  'mt-1 w-full resize-y rounded-xl border border-cream-300 bg-cream-50 p-3 text-sm text-sage-900 focus:border-sage-500 focus:outline-none'

/**
 * Una nota de sesión con autoguardado (sin botón "guardar"). Las
 * anteriores aparecen plegadas para que el historial se lea como una
 * línea de tiempo; "Próximos pasos" va primero y destacado.
 */
export function NotaSesion({
  registro,
  abiertaInicial,
  onExportar,
  onEliminar,
}: {
  registro: HistorialClinico
  abiertaInicial: boolean
  onExportar: () => void
  onEliminar: () => void
}) {
  const [abierta, setAbierta] = useState(abiertaInicial)
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

  const fecha = new Date(registro.creado_en).toLocaleDateString('es-BO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const resumen = (motivo || intervencion || proximosPasos || 'Nota vacía').slice(0, 90)

  return (
    <li className="relative pl-7">
      <span className="absolute left-0 top-5 h-3 w-3 rounded-full border-2 border-sage-500 bg-cream-50" aria-hidden="true" />
      <article className="rounded-3xl border border-cream-300/70 bg-cream-50 shadow-sm">
        <button
          onClick={() => setAbierta((v) => !v)}
          aria-expanded={abierta}
          className="flex w-full items-center justify-between gap-3 rounded-3xl px-5 py-4 text-left hover:bg-sage-50/60"
        >
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-sage-900 first-letter:uppercase">{fecha}</span>
            {!abierta && <span className="block truncate text-xs text-sage-600">{resumen}</span>}
          </span>
          <span className="flex items-center gap-3">
            <IndicadorAutoguardado estado={estado} />
            <span
              aria-hidden="true"
              className="flex items-center gap-1.5 rounded-full border border-sage-300 bg-sage-100 px-3 py-1.5 text-xs font-medium text-sage-800"
            >
              {abierta ? 'Ocultar' : 'Ver nota'}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className={`h-4 w-4 transition-transform ${abierta ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </button>

        {abierta && (
          <div className="space-y-4 border-t border-cream-300/60 px-5 pb-5 pt-4">
            <div className="rounded-2xl border-2 border-terracotta-200 bg-terracotta-50 p-4">
              <label htmlFor={`pp-${registro.id}`} className="text-xs font-semibold uppercase tracking-wide text-terracotta-600">
                Próximos pasos
              </label>
              <textarea
                id={`pp-${registro.id}`}
                value={proximosPasos}
                onChange={(e) => setProximosPasos(e.target.value)}
                rows={2}
                placeholder="¿Qué sigue en el proceso de este paciente?"
                className="mt-2 w-full resize-y bg-transparent text-sm text-sage-900 placeholder:text-sage-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor={`mo-${registro.id}`} className="text-xs font-medium text-sage-700">Motivo</label>
              <textarea id={`mo-${registro.id}`} value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={2} className={area} />
            </div>
            <div>
              <label htmlFor={`in-${registro.id}`} className="text-xs font-medium text-sage-700">Intervención</label>
              <textarea id={`in-${registro.id}`} value={intervencion} onChange={(e) => setIntervencion(e.target.value)} rows={4} className={area} />
            </div>
            <div>
              <label htmlFor={`ta-${registro.id}`} className="text-xs font-medium text-sage-700">Tareas / homework</label>
              <textarea id={`ta-${registro.id}`} value={tareasHomework} onChange={(e) => setTareasHomework(e.target.value)} rows={2} className={area} />
            </div>

            <div className="flex justify-end gap-2 text-sm">
              <button onClick={onExportar} className="rounded-full border border-sage-300 px-4 py-1.5 font-medium text-sage-800 hover:bg-sage-50">
                Exportar PDF
              </button>
              <button onClick={onEliminar} className="rounded-full px-4 py-1.5 font-medium text-terracotta-600 hover:bg-terracotta-50">
                Eliminar nota
              </button>
            </div>
          </div>
        )}
      </article>
    </li>
  )
}
