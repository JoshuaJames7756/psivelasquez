import { useState } from 'react'
import { useTareas } from '../hooks/useTareas'
import type { EstadoTarea, Tarea } from '../../shared/types/db'

const columnas: { estado: EstadoTarea; titulo: string }[] = [
  { estado: 'todo', titulo: 'Por hacer' },
  { estado: 'en_progreso', titulo: 'En progreso' },
  { estado: 'hecha', titulo: 'Hechas' },
]

const colorPrioridad: Record<Tarea['prioridad'], string> = {
  alta: 'bg-terracotta-400',
  media: 'bg-sage-500',
  baja: 'bg-sage-300',
}

function TarjetaTarea({
  tarea,
  onAvanzar,
}: {
  tarea: Tarea
  onAvanzar: (id: string, siguiente: EstadoTarea) => void
}) {
  const siguienteEstado: Partial<Record<EstadoTarea, EstadoTarea>> = {
    todo: 'en_progreso',
    en_progreso: 'hecha',
  }
  const siguiente = siguienteEstado[tarea.estado]

  return (
    <div className="rounded-lg border border-forest-700 bg-forest-800 p-3">
      <div className="flex items-start gap-2">
        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${colorPrioridad[tarea.prioridad]}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-cream-50">{tarea.titulo}</p>
          {tarea.fecha_limite && (
            <p className="mt-1 text-xs text-cream-300">
              {new Date(tarea.fecha_limite).toLocaleDateString('es-BO', {
                day: 'numeric',
                month: 'short',
              })}
            </p>
          )}
        </div>
      </div>
      {siguiente && (
        <button
          onClick={() => onAvanzar(tarea.id, siguiente)}
          className="mt-2 text-xs font-medium text-sage-400 hover:text-sage-300"
        >
          {siguiente === 'en_progreso' ? 'Empezar →' : 'Marcar hecha →'}
        </button>
      )}
    </div>
  )
}

function FormularioTareaRapida({ onCrear }: { onCrear: (titulo: string) => void }) {
  const [titulo, setTitulo] = useState('')

  function manejarSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!titulo.trim()) return
    onCrear(titulo.trim())
    setTitulo('')
  }

  return (
    <form onSubmit={manejarSubmit} className="mb-6 flex gap-2">
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Nueva tarea..."
        className="flex-1 rounded-lg border border-forest-700 bg-forest-800 px-3 py-2 text-sm text-cream-50 placeholder:text-cream-300/50 focus:border-sage-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-sage-700 px-4 py-2 text-sm font-medium text-cream-50 hover:bg-sage-800"
      >
        Agregar
      </button>
    </form>
  )
}

export function TareasPage() {
  const { tareas, cargando, crear, cambiarEstado } = useTareas()

  if (cargando) {
    return <p className="p-8 text-cream-300">Cargando tareas...</p>
  }

  return (
    <section className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-cream-50">Tareas</h1>

      <div className="mt-6 max-w-md">
        <FormularioTareaRapida onCrear={(titulo) => crear({ titulo })} />
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-3">
        {columnas.map((col) => (
          <div key={col.estado}>
            <h2 className="mb-3 text-sm font-semibold text-cream-300">{col.titulo}</h2>
            <div className="space-y-2">
              {tareas
                .filter((t) => t.estado === col.estado)
                .map((tarea) => (
                  <TarjetaTarea key={tarea.id} tarea={tarea} onAvanzar={cambiarEstado} />
                ))}
              {tareas.filter((t) => t.estado === col.estado).length === 0 && (
                <p className="text-xs text-cream-300/50">Nada acá.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
