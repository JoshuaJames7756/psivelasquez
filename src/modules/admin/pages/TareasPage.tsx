import { useState } from 'react'
import { useTareas } from '../hooks/useTareas'
import { botonPrimario, campo, tarjeta } from '../utils/estilos'
import type { EstadoTarea, PrioridadTarea, Tarea } from '../../shared/types/db'

const columnas: { estado: EstadoTarea; titulo: string; vacio: string }[] = [
  { estado: 'todo', titulo: 'Por hacer', vacio: 'Nada pendiente.' },
  { estado: 'en_progreso', titulo: 'En progreso', vacio: 'Nada en curso.' },
  { estado: 'hecha', titulo: 'Hechas', vacio: 'Aún no hay tareas hechas.' },
]

const colorPrioridad: Record<Tarea['prioridad'], string> = {
  alta: 'bg-terracotta-400',
  media: 'bg-sage-500',
  baja: 'bg-sage-300',
}

const siguienteEstado: Partial<Record<EstadoTarea, { a: EstadoTarea; texto: string }>> = {
  todo: { a: 'en_progreso', texto: 'Empezar' },
  en_progreso: { a: 'hecha', texto: 'Marcar hecha' },
}

function TarjetaTarea({
  tarea,
  onAvanzar,
  onEliminar,
}: {
  tarea: Tarea
  onAvanzar: (id: string, siguiente: EstadoTarea) => void
  onEliminar: (id: string) => void
}) {
  const siguiente = siguienteEstado[tarea.estado]
  return (
    <div className="rounded-2xl border border-cream-300/70 bg-white p-3 shadow-sm">
      <div className="flex items-start gap-2">
        <span
          title={`Prioridad ${tarea.prioridad}`}
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${colorPrioridad[tarea.prioridad]}`}
        />
        <div className="min-w-0 flex-1">
          <p className={`text-sm text-sage-900 ${tarea.estado === 'hecha' ? 'line-through opacity-60' : ''}`}>
            {tarea.titulo}
          </p>
          {tarea.fecha_limite && (
            <p className="mt-1 text-xs text-sage-600">
              Para el{' '}
              {new Date(tarea.fecha_limite).toLocaleDateString('es-BO', {
                day: 'numeric',
                month: 'short',
                timeZone: 'UTC',
              })}
            </p>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        {siguiente ? (
          <button
            onClick={() => onAvanzar(tarea.id, siguiente.a)}
            className="rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-800 hover:bg-sage-200"
          >
            {siguiente.texto}
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={() => {
            if (window.confirm('¿Eliminar esta tarea?')) onEliminar(tarea.id)
          }}
          className="text-xs text-terracotta-600 hover:underline"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export function TareasPage() {
  const { tareas, cargando, crear, cambiarEstado, eliminar } = useTareas()
  const [titulo, setTitulo] = useState('')
  const [prioridad, setPrioridad] = useState<PrioridadTarea>('media')
  const [fecha, setFecha] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!titulo.trim() || enviando) return
    setEnviando(true)
    try {
      await crear({ titulo: titulo.trim(), prioridad, fechaLimite: fecha || undefined })
      setTitulo('')
      setFecha('')
      setPrioridad('media')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif-brand text-3xl text-sage-900">Tareas</h1>
        <p className="mt-1 text-sm text-sage-700">Lo pendiente de tu consulta, de un vistazo.</p>
      </header>

      <form onSubmit={enviar} className={`${tarjeta} flex flex-wrap items-end gap-3 p-4`}>
        <label className="min-w-[14rem] flex-1 text-xs font-medium text-sage-700">
          Nueva tarea
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Llamar a un paciente nuevo"
            maxLength={200}
            className={`${campo} mt-1`}
          />
        </label>
        <label className="text-xs font-medium text-sage-700">
          Prioridad
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value as PrioridadTarea)}
            className={`${campo} mt-1`}
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </label>
        <label className="text-xs font-medium text-sage-700">
          Fecha límite
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={`${campo} mt-1`} />
        </label>
        <button type="submit" disabled={!titulo.trim() || enviando} className={botonPrimario}>
          {enviando ? 'Agregando...' : 'Agregar'}
        </button>
      </form>

      {cargando ? (
        <p className="text-sm text-sage-700">Cargando tareas...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {columnas.map((col) => {
            const items = tareas.filter((t) => t.estado === col.estado)
            return (
              <div key={col.estado} className="rounded-3xl bg-cream-100/70 p-3">
                <h2 className="mb-3 flex items-center justify-between px-1 text-sm font-semibold text-sage-800">
                  {col.titulo}
                  <span className="rounded-full bg-cream-50 px-2 py-0.5 text-xs font-medium text-sage-700">
                    {items.length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {items.map((t) => (
                    <TarjetaTarea key={t.id} tarea={t} onAvanzar={cambiarEstado} onEliminar={eliminar} />
                  ))}
                  {items.length === 0 && <p className="px-1 py-3 text-xs text-sage-600">{col.vacio}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
