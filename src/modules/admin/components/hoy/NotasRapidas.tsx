import { useState } from 'react'
import { useNotasRapidas } from '../../hooks/useNotasRapidas'

const MAX = 2000

export function NotasRapidas() {
  const { notas, cargando, error, agregar, eliminar } = useNotasRapidas()
  const [texto, setTexto] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!texto.trim() || guardando) return
    setGuardando(true)
    if (await agregar(texto)) setTexto('')
    setGuardando(false)
  }

  return (
    <section className="rounded-3xl border border-cream-300/70 bg-cream-50 p-5 shadow-sm" aria-labelledby="titulo-notas">
      <h2 id="titulo-notas" className="font-serif-brand text-xl text-sage-900">
        Notas rápidas
      </h2>

      <form onSubmit={guardar} className="mt-3">
        <label htmlFor="nota-rapida" className="sr-only">
          Nueva nota
        </label>
        <textarea
          id="nota-rapida"
          value={texto}
          onChange={(e) => setTexto(e.target.value.slice(0, MAX))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) guardar(e)
          }}
          rows={3}
          placeholder="Anota algo rápido..."
          className="w-full resize-none rounded-2xl border border-cream-300 bg-cream-100/60 p-3 text-sm text-sage-900 placeholder:text-sage-500 focus:border-sage-500 focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-sage-500">Ctrl + Enter para guardar</span>
          <button
            type="submit"
            disabled={!texto.trim() || guardando}
            className="rounded-full bg-sage-700 px-4 py-1.5 text-sm font-medium text-cream-50 hover:bg-sage-800 disabled:opacity-40"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-terracotta-600">{error}</p>}
      </form>

      {cargando ? (
        <div className="mt-4 h-10 animate-pulse rounded-xl bg-sage-100" aria-busy="true" />
      ) : notas.length === 0 ? (
        <p className="mt-4 text-sm text-sage-600">Aún no hay notas.</p>
      ) : (
        <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
          {notas.map((n) => (
            <li key={n.id} className="group rounded-2xl bg-cream-200/50 px-4 py-3">
              <p className="whitespace-pre-wrap break-words text-sm text-sage-900">{n.texto}</p>
              <div className="mt-1 flex items-center justify-between text-xs text-sage-600">
                <span>
                  {new Date(n.creado_en).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })}
                  {n.paciente_nombre ? ` · ${n.paciente_nombre}` : ''}
                </span>
                <button
                  onClick={() => eliminar(n.id)}
                  aria-label="Eliminar nota"
                  className="rounded-full px-2 py-0.5 text-terracotta-600 hover:bg-terracotta-100"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
