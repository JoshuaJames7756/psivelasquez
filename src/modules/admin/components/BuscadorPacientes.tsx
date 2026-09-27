import { useState } from 'react'
import { colorAvatar, inicialesNombre } from '../../shared/utils/avatarColor'
import { useBusquedaPacientes } from '../hooks/useBusquedaPacientes'

interface Props {
  onSeleccionar: (id: string) => void
  pacienteSeleccionadoId: string | null
}

export function BuscadorPacientes({ onSeleccionar, pacienteSeleccionadoId }: Props) {
  const [termino, setTermino] = useState('')
  const { resultados, cargando } = useBusquedaPacientes(termino)

  return (
    <div className="flex h-full flex-col border-r border-forest-700">
      <div className="p-4">
        <input
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          placeholder="Buscar paciente..."
          className="w-full rounded-lg border border-forest-700 bg-forest-800 px-3 py-2 text-sm text-cream-50 placeholder:text-cream-300/50 focus:border-sage-500 focus:outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {cargando && <p className="px-4 text-sm text-cream-300">Buscando...</p>}
        {!cargando && resultados.length === 0 && (
          <p className="px-4 text-sm text-cream-300">
            {termino ? 'Sin resultados' : 'Escribe para buscar'}
          </p>
        )}
        {resultados.map((p) => (
          <button
            key={p.id}
            onClick={() => onSeleccionar(p.id)}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-forest-800 ${
              pacienteSeleccionadoId === p.id ? 'bg-forest-800' : ''
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-cream-50 ${colorAvatar(p.id)}`}
            >
              {inicialesNombre(p.nombre)}
            </span>
            <span>
              <p className="text-sm font-medium text-cream-50">{p.nombre}</p>
              <p className="text-xs text-cream-300">
                {p.primera_vez ? 'Primera vez' : 'Paciente recurrente'}
              </p>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
