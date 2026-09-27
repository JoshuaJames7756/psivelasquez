import { useState } from 'react'
import { FormularioReserva } from './FormularioReserva'
import { useSlotsPublicos, type SlotPublico } from '../hooks/useSlotsPublicos'
import type { EstadoCita } from '../../shared/types/db'

const estiloPorEstado: Record<EstadoCita, string> = {
  disponible: 'border-sage-400 text-sage-700 hover:bg-sage-100 cursor-pointer',
  solicitada: 'border-terracotta-300 bg-terracotta-50 text-terracotta-600 cursor-not-allowed',
  confirmada: 'border-sage-300 bg-sage-200 text-sage-500 cursor-not-allowed',
  liberada: 'border-sage-400 text-sage-700 hover:bg-sage-100 cursor-pointer',
  vencida: 'border-sage-200 bg-sage-50 text-sage-400 cursor-not-allowed',
}

const microcopyPorEstado: Record<EstadoCita, string> = {
  disponible: 'Escríbeme por WhatsApp para reservarlo',
  solicitada: 'Cupo reservado',
  confirmada: 'Cupo reservado',
  liberada: 'Escríbeme por WhatsApp para reservarlo',
  vencida: 'No disponible',
}

export function ModalidadAgenda() {
  const { slots, cargando, error, recargar } = useSlotsPublicos()
  const [slotSeleccionado, setSlotSeleccionado] = useState<SlotPublico | null>(null)
  const [reservaExitosa, setReservaExitosa] = useState(false)

  function manejarClick(slot: SlotPublico) {
    if (slot.estado !== 'disponible' && slot.estado !== 'liberada') return
    setSlotSeleccionado(slot)
  }

  async function manejarReservado() {
    setSlotSeleccionado(null)
    setReservaExitosa(true)
    await recargar()
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="font-[var(--font-serif-brand)] text-3xl text-sage-900">
        Modalidad y agenda
      </h2>
      <p className="mt-4 text-sage-700">
        Atiendo un solo día a la semana para poder darle a cada sesión la atención que merece.
        Aquí puedes ver los cupos disponibles del próximo sábado, presencial u online.
      </p>

      {reservaExitosa && (
        <div className="mt-6 rounded-xl border-2 border-sage-400 bg-sage-100 p-4 text-sm text-sage-800">
          Tu cupo quedó solicitado. Escríbeme por WhatsApp para coordinar el pago del 50% y
          confirmarlo.
        </div>
      )}

      {cargando && <p className="mt-10 text-sage-500">Cargando cupos...</p>}
      {error && <p className="mt-10 text-terracotta-600">{error}</p>}

      {!cargando && !error && slots.length === 0 && (
        <p className="mt-10 text-sage-500">No hay cupos publicados todavía para el próximo sábado.</p>
      )}

      {!cargando && slots.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {slots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => manejarClick(slot)}
              disabled={slot.estado !== 'disponible' && slot.estado !== 'liberada'}
              className={`rounded-xl border-2 p-4 text-center transition ${estiloPorEstado[slot.estado]}`}
            >
              <p className="font-semibold">{slot.hora_inicio.slice(0, 5)}</p>
              <p className="mt-1 text-xs">{microcopyPorEstado[slot.estado]}</p>
            </button>
          ))}
        </div>
      )}

      <FormularioReserva
        slot={slotSeleccionado}
        onClose={() => setSlotSeleccionado(null)}
        onReservado={manejarReservado}
      />
    </section>
  )
}
