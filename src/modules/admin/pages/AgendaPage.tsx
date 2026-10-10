import { useState } from 'react'
import { chipEstado, esActivo, etiquetaEstado } from '../components/hoy/estados'
import { useSlotsSabado } from '../hooks/useSlotsSabado'
import { botonPrimario, botonSecundario, tarjeta } from '../utils/estilos'
import type { SlotSabadoPanel } from '../../shared/types/db'
import { colorAvatar, inicialesNombre } from '../../shared/utils/avatarColor'

const aISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function proximoSabado() {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7))
  return d
}

export function AgendaPage() {
  const [sabado, setSabado] = useState(proximoSabado)
  const fecha = aISO(sabado)
  const { slots, cargando, error, recargar, aplicarAccion, reagendar } = useSlotsSabado(fecha)
  const [moviendo, setMoviendo] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const mover = (dias: number) => {
    const d = new Date(sabado)
    d.setDate(d.getDate() + dias)
    setSabado(d)
    setMoviendo(null)
  }

  async function ejecutar(accion: () => Promise<void>) {
    setAviso(null)
    try {
      await accion()
    } catch (e) {
      setAviso(e instanceof Error ? e.message : 'No se pudo completar la acción')
    }
  }

  const titulo = sabado.toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const conReserva = slots.filter((s) => esActivo(s.estado)).length
  const porConfirmar = slots.filter((s) => s.estado === 'solicitada').length
  const libres = slots.filter((s) => s.estado === 'disponible' || s.estado === 'liberada').length

  function Fila({ slot }: { slot: SlotSabadoPanel }) {
    const libre = slot.estado === 'disponible' || slot.estado === 'liberada'
    const esOrigen = moviendo === slot.id
    return (
      <li className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 ${esOrigen ? 'bg-terracotta-50' : ''}`}>
        <span className="font-serif-brand w-14 text-lg text-sage-900">{slot.hora_inicio.slice(0, 5)}</span>
        <div className="flex min-w-[8rem] flex-1 items-center gap-3">
          {slot.paciente_nombre && slot.paciente_id ? (
            <>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-cream-50 ${colorAvatar(slot.paciente_id)}`}>
                {inicialesNombre(slot.paciente_nombre)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-sage-900">{slot.paciente_nombre}</span>
                {slot.modalidad && <span className="block text-xs capitalize text-sage-600">{slot.modalidad}</span>}
              </span>
            </>
          ) : (
            <span className="text-sm text-sage-600">{libre ? 'Horario libre' : 'Sin paciente'}</span>
          )}
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-medium ${chipEstado[slot.estado]}`}>{etiquetaEstado[slot.estado]}</span>

        <div className="flex basis-full flex-wrap justify-end gap-2 max-sm:empty:hidden sm:min-w-[16rem] sm:basis-auto">
          {moviendo && libre && (
            <button
              className={botonPrimario}
              onClick={() => ejecutar(async () => { await reagendar(moviendo, slot.id); setMoviendo(null) })}
            >
              Mover aquí
            </button>
          )}
          {!moviendo && slot.estado === 'solicitada' && (
            <button className={botonPrimario} onClick={() => ejecutar(() => aplicarAccion(slot.id, 'confirmar'))}>Confirmar</button>
          )}
          {!moviendo && slot.estado === 'confirmada' && (
            <button className={botonPrimario} onClick={() => ejecutar(() => aplicarAccion(slot.id, 'pagar'))}>Marcar pagado</button>
          )}
          {!moviendo && slot.estado === 'pagada' && (
            <button className={botonSecundario} onClick={() => ejecutar(() => aplicarAccion(slot.id, 'completar'))}>Completar</button>
          )}
          {!moviendo && slot.paciente_id && ['solicitada', 'confirmada', 'pagada'].includes(slot.estado) && (
            <button className={botonSecundario} onClick={() => setMoviendo(slot.id)}>Mover</button>
          )}
          {!moviendo && slot.paciente_id && ['solicitada', 'confirmada', 'pagada'].includes(slot.estado) && (
            <button
              className="rounded-full px-3 py-1.5 text-sm font-medium text-terracotta-600 hover:bg-terracotta-50"
              onClick={() => { if (window.confirm('¿Cancelar esta cita?')) ejecutar(() => aplicarAccion(slot.id, 'cancelar')) }}
            >
              Cancelar
            </button>
          )}
          {!moviendo && slot.estado === 'cancelada' && (
            <button className={botonSecundario} onClick={() => ejecutar(() => aplicarAccion(slot.id, 'liberar'))}>Liberar horario</button>
          )}
          {esOrigen && <button className={botonSecundario} onClick={() => setMoviendo(null)}>Cancelar movimiento</button>}
        </div>
      </li>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif-brand text-3xl text-sage-900">Agenda</h1>
          <p className="text-sm text-sage-600 first-letter:uppercase">{titulo}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => mover(-7)} aria-label="Sábado anterior" className={`${botonSecundario} h-10 w-10 !p-0`}>←</button>
          <button onClick={() => { setSabado(proximoSabado()); setMoviendo(null) }} className={botonSecundario}>Próximo sábado</button>
          <button onClick={() => mover(7)} aria-label="Sábado siguiente" className={`${botonSecundario} h-10 w-10 !p-0`}>→</button>
        </div>
      </div>

      {!cargando && slots.length > 0 && (
        <p className="text-sm text-sage-700">
          {conReserva} con reserva · {porConfirmar} por confirmar · {libres} libres
        </p>
      )}

      {moviendo && (
        <p role="status" className="rounded-2xl bg-terracotta-50 px-4 py-3 text-sm text-terracotta-600">
          Elige el horario libre al que quieres mover la cita.
        </p>
      )}
      {aviso && <p role="alert" className="rounded-2xl bg-terracotta-50 px-4 py-3 text-sm text-terracotta-600">{aviso}</p>}

      <section className={tarjeta} aria-label="Horarios">
        {cargando ? (
          <div className="space-y-3 p-5" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-sage-100" />)}
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-sage-700">
            <p>No se pudo cargar la agenda. {error}</p>
            <button onClick={recargar} className={`${botonSecundario} mt-3`}>Reintentar</button>
          </div>
        ) : slots.length === 0 ? (
          <p className="p-6 text-sm text-sage-700">
            No hay horarios generados para este sábado. Se crean automáticamente para las próximas semanas.
          </p>
        ) : (
          <ul className="divide-y divide-cream-300/50">
            {slots.map((s) => <Fila key={s.id} slot={s} />)}
          </ul>
        )}
      </section>
    </div>
  )
}
