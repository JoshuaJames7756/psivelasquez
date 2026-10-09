import { Link } from 'react-router-dom'
import { linkWhatsApp } from '../../../shared/utils/whatsapp'
import type { Tarea } from '../../../shared/types/db'
import type { PacienteEnRiesgo } from '../../hooks/usePacientesEnRiesgo'

const pesoPrioridad = { alta: 0, media: 1, baja: 2 } as const

function fechaCorta(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })
}

export function Atencion({
  enRiesgo,
  tareas,
  onHecha,
}: {
  enRiesgo: PacienteEnRiesgo[]
  tareas: Tarea[]
  onHecha: (id: string) => void
}) {
  const pendientes = tareas
    .filter((t) => t.estado === 'todo' || t.estado === 'en_progreso')
    .sort((a, b) => pesoPrioridad[a.prioridad] - pesoPrioridad[b.prioridad])
    .slice(0, 4)

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-cream-300/70 bg-cream-50 p-5 shadow-sm" aria-labelledby="titulo-riesgo">
        <h2 id="titulo-riesgo" className="font-serif-brand text-xl text-sage-900">
          Pacientes a retomar
        </h2>
        {enRiesgo.length === 0 ? (
          <p className="mt-3 text-sm text-sage-600">Nadie en riesgo de abandono por ahora.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {enRiesgo.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-2xl bg-terracotta-50 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-sage-900">{p.nombre}</p>
                  <p className="text-xs text-terracotta-600">Última sesión: {fechaCorta(p.ultima_cita_confirmada)}</p>
                </div>
                {p.telefono && (
                  <a
                    href={linkWhatsApp(
                      p.telefono,
                      `Hola ${p.nombre.split(' ')[0]}, ¿cómo estás? Quería saber si te gustaría retomar tu proceso.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-full bg-sage-700 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-sage-800"
                  >
                    WhatsApp
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl border border-cream-300/70 bg-cream-50 p-5 shadow-sm" aria-labelledby="titulo-tareas">
        <div className="flex items-baseline justify-between">
          <h2 id="titulo-tareas" className="font-serif-brand text-xl text-sage-900">
            Tareas pendientes
          </h2>
          <Link to="/admin/tareas" className="text-sm font-medium text-sage-700 underline hover:text-sage-900">
            Ver todas
          </Link>
        </div>
        {pendientes.length === 0 ? (
          <p className="mt-3 text-sm text-sage-600">Sin tareas pendientes. Puedes crear una en Tareas.</p>
        ) : (
          <ul className="mt-3 space-y-1">
            {pendientes.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-xl px-1 py-1.5">
                <button
                  onClick={() => onHecha(t.id)}
                  aria-label={`Marcar como hecha: ${t.titulo}`}
                  className="h-5 w-5 shrink-0 rounded-md border-2 border-sage-300 transition-colors hover:border-sage-600 hover:bg-sage-100"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-sage-900">{t.titulo}</span>
                {t.prioridad === 'alta' && (
                  <span className="rounded-full bg-terracotta-100 px-2 py-0.5 text-xs text-terracotta-600">Alta</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
