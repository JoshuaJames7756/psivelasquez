import { AnimatePresence, motion } from 'motion/react'
import type { SlotSabadoPanel } from '../../shared/types/db'

const estiloPorEstado: Record<SlotSabadoPanel['estado'], string> = {
  disponible: 'border-sage-700/30 bg-sage-800/40 text-sage-300',
  solicitada: 'border-terracotta-400 bg-terracotta-500/20 text-terracotta-200',
  confirmada: 'border-sage-400 bg-sage-500/25 text-sage-100',
  liberada: 'border-sage-700/30 bg-sage-800/40 text-sage-300',
  vencida: 'border-cream-300/20 bg-forest-800 text-cream-300/50',
}

const etiquetaPorEstado: Record<SlotSabadoPanel['estado'], string> = {
  disponible: 'Disponible',
  solicitada: 'Solicitada',
  confirmada: 'Confirmada',
  liberada: 'Liberada',
  vencida: 'Vencida',
}

interface Props {
  slots: SlotSabadoPanel[]
  onConfirmar: (id: string) => Promise<void>
  onLiberar: (id: string) => Promise<void>
}

interface SlotCardProps {
  slot: SlotSabadoPanel
  onConfirmar: (id: string) => Promise<void>
  onLiberar: (id: string) => Promise<void>
}

function SlotCard({ slot, onConfirmar, onLiberar }: SlotCardProps) {
  return (
    <motion.div
      layout
      className={`relative rounded-xl border-2 p-4 transition-colors ${estiloPorEstado[slot.estado]}`}
    >
      <p className="text-lg font-semibold">{slot.hora_inicio.slice(0, 5)}</p>
      <p className="mt-1 text-xs uppercase tracking-wide opacity-80">
        {etiquetaPorEstado[slot.estado]}
      </p>

      <AnimatePresence>
        {slot.estado === 'confirmada' && (
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            viewBox="0 0 24 24"
            className="absolute right-3 top-3 h-5 w-5"
            fill="none"
          >
            {/* Check que se dibuja al confirmar, no aparece instantáneo */}
            <motion.path
              d="M4 12l5 5L20 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {slot.estado === 'solicitada' && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onConfirmar(slot.id)}
            className="rounded-full bg-sage-600 px-3 py-1 text-xs font-medium text-cream-50 hover:bg-sage-500"
          >
            Confirmar pago
          </button>
          <button
            onClick={() => onLiberar(slot.id)}
            className="rounded-full border border-terracotta-300 px-3 py-1 text-xs font-medium text-terracotta-200 hover:bg-terracotta-500/10"
          >
            Liberar
          </button>
        </div>
      )}
    </motion.div>
  )
}

export function OcupacionSabado({ slots, onConfirmar, onLiberar }: Props) {
  const ocupados = slots.filter((s) => s.estado !== 'disponible').length

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-cream-50">Próximo sábado</h2>
        <span className="text-sm text-cream-300">
          {ocupados} de {slots.length || 8} cupos con actividad
        </span>
      </div>
      <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {slots.map((slot) => (
          <SlotCard key={slot.id} slot={slot} onConfirmar={onConfirmar} onLiberar={onLiberar} />
        ))}
      </motion.div>
    </div>
  )
}
