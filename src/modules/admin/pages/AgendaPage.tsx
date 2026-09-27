import { useState } from 'react'
import { colorAvatar, inicialesNombre } from '../../shared/utils/avatarColor'
import { useSlotsSabado } from '../hooks/useSlotsSabado'
import type { SlotSabadoPanel } from '../../shared/types/db'

const etiquetaPorEstado: Record<SlotSabadoPanel['estado'], string> = {
  disponible: 'Disponible',
  solicitada: 'Solicitada',
  confirmada: 'Confirmada',
  liberada: 'Liberada',
  vencida: 'Vencida',
}

const estiloPorEstado: Record<SlotSabadoPanel['estado'], string> = {
  disponible: 'border-forest-700 bg-forest-800',
  solicitada: 'border-terracotta-400 bg-terracotta-500/10',
  confirmada: 'border-sage-500 bg-sage-500/10',
  liberada: 'border-forest-700 bg-forest-800',
  vencida: 'border-cream-300/20 bg-forest-800',
}

export function AgendaPage() {
  const { slots, cargando, liberar, reagendar } = useSlotsSabado()
  const [origenSeleccionado, setOrigenSeleccionado] = useState<string | null>(null)

  function manejarClickSlot(slot: SlotSabadoPanel) {
    // Modo reagendamiento: primero elegís el slot con paciente (origen),
    // después un slot disponible (destino).
    if (origenSeleccionado && slot.estado === 'disponible') {
      reagendar(origenSeleccionado, slot.id)
      setOrigenSeleccionado(null)
      return
    }

    if (slot.paciente_id) {
      setOrigenSeleccionado(slot.id === origenSeleccionado ? null : slot.id)
    }
  }

  if (cargando) {
    return <p className="p-8 text-cream-300">Cargando agenda...</p>
  }

  return (
    <section className="p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-cream-50">Agenda del sábado</h1>
        {origenSeleccionado && (
          <p className="text-sm text-terracotta-300">
            Elige un cupo disponible para mover esta cita, o vuelve a hacer clic para cancelar.
          </p>
        )}
      </div>

      <div className="mt-8 space-y-3">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => manejarClickSlot(slot)}
            className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-colors ${estiloPorEstado[slot.estado]} ${
              origenSeleccionado === slot.id ? 'ring-2 ring-terracotta-400' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="w-14 font-semibold text-cream-50">
                {slot.hora_inicio.slice(0, 5)}
              </span>
              {slot.paciente_nombre && (
                <>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-cream-50 ${colorAvatar(slot.paciente_id!)}`}
                  >
                    {inicialesNombre(slot.paciente_nombre)}
                  </span>
                  <span className="text-sm text-cream-50">{slot.paciente_nombre}</span>
                </>
              )}
              <span className="text-xs text-cream-300">{etiquetaPorEstado[slot.estado]}</span>
            </div>

            {slot.paciente_id && (
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  liberar(slot.id)
                }}
                className="rounded-full border border-terracotta-300 px-3 py-1 text-xs text-terracotta-200 hover:bg-terracotta-500/10"
              >
                Liberar
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
