import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import type { SlotSabadoPanel } from '../../../shared/types/db'
import { chipEstado, etiquetaEstado } from './estados'

type Accion = 'confirmar' | 'pagar' | 'completar' | 'cancelar' | 'liberar'

const boton =
  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50'

function Fila({
  slot,
  onAccion,
}: {
  slot: SlotSabadoPanel
  onAccion: (id: string, accion: Accion) => Promise<void>
}) {
  const libre = slot.estado === 'disponible' || slot.estado === 'liberada'

  return (
    <motion.li
      layout
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 ${libre ? 'opacity-70' : ''}`}
    >
      <span className="font-serif-brand w-14 text-lg text-sage-900">{slot.hora_inicio.slice(0, 5)}</span>

      <div className="min-w-[7rem] flex-1">
        <p className="truncate text-sm font-medium text-sage-900">
          {slot.paciente_nombre ?? (libre ? 'Horario libre' : 'Sin paciente asignado')}
        </p>
        {slot.modalidad && (
          <p className="text-xs capitalize text-sage-600">{slot.modalidad}</p>
        )}
      </div>

      <span className={`rounded-full px-3 py-1 text-xs font-medium ${chipEstado[slot.estado]}`}>
        {etiquetaEstado[slot.estado]}
      </span>

      <div className="flex basis-full justify-end gap-2 max-sm:empty:hidden sm:min-w-[11rem] sm:basis-auto">
        {slot.estado === 'solicitada' && (
          <>
            <button onClick={() => onAccion(slot.id, 'confirmar')} className={`${boton} bg-sage-700 text-cream-50 hover:bg-sage-800`}>
              Confirmar
            </button>
            <button onClick={() => onAccion(slot.id, 'liberar')} className={`${boton} border border-cream-300 text-sage-700 hover:bg-cream-100`}>
              Liberar
            </button>
          </>
        )}
        {slot.estado === 'confirmada' && (
          <>
            <button onClick={() => onAccion(slot.id, 'pagar')} className={`${boton} bg-sage-700 text-cream-50 hover:bg-sage-800`}>
              Marcar pagado
            </button>
            <button onClick={() => onAccion(slot.id, 'liberar')} className={`${boton} border border-cream-300 text-sage-700 hover:bg-cream-100`}>
              Liberar
            </button>
          </>
        )}
        {slot.estado === 'pagada' && (
          <button onClick={() => onAccion(slot.id, 'completar')} className={`${boton} border border-sage-300 text-sage-800 hover:bg-sage-50`}>
            Completar
          </button>
        )}
      </div>
    </motion.li>
  )
}

export function AgendaSabado({
  slots,
  cargando,
  error,
  fechaTexto,
  onAccion,
  onReintentar,
}: {
  slots: SlotSabadoPanel[]
  cargando: boolean
  error: string | null
  fechaTexto: string | null
  onAccion: (id: string, accion: Accion) => Promise<void>
  onReintentar: () => void
}) {
  return (
    <section className="rounded-3xl border border-cream-300/70 bg-cream-50 shadow-sm" aria-labelledby="titulo-agenda">
      <div className="flex items-end justify-between gap-3 border-b border-cream-300/60 px-5 py-4">
        <div>
          <h2 id="titulo-agenda" className="font-serif-brand text-xl text-sage-900">
            Agenda del sábado
          </h2>
          {fechaTexto && <p className="text-sm text-sage-600 first-letter:uppercase">{fechaTexto}</p>}
        </div>
        <Link to="/admin/agenda" className="text-sm font-medium text-sage-700 underline hover:text-sage-900">
          Ver agenda
        </Link>
      </div>

      {cargando ? (
        <div className="space-y-3 p-5" aria-busy="true" aria-label="Cargando horarios">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-xl bg-sage-100" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-sm text-sage-700">
          <p>No se pudieron cargar los horarios. {error}</p>
          <button onClick={onReintentar} className="mt-3 rounded-full border border-sage-300 px-4 py-1.5 font-medium hover:bg-sage-50">
            Reintentar
          </button>
        </div>
      ) : slots.length === 0 ? (
        <p className="p-6 text-sm text-sage-700">
          Todavía no hay horarios generados para el próximo sábado.
        </p>
      ) : (
        <ul className="divide-y divide-cream-300/50">
          {slots.map((s) => (
            <Fila key={s.id} slot={s} onAccion={onAccion} />
          ))}
        </ul>
      )}
    </section>
  )
}
