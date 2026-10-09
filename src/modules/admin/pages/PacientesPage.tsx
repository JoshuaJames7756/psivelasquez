import { useState } from 'react'
import { FichaPacientePanel } from '../components/FichaPacientePanel'
import { ListaPacientes } from '../components/pacientes/ListaPacientes'

/**
 * Lista + ficha. En escritorio van lado a lado; en móvil se ve una a
 * la vez (lista, y al elegir un paciente, su ficha con botón Volver).
 */
export function PacientesPage() {
  const [pacienteId, setPacienteId] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  return (
    <div className="mx-auto grid h-[calc(100vh-8rem)] min-h-[34rem] max-w-7xl overflow-hidden rounded-3xl border border-cream-300/70 bg-cream-50 shadow-sm md:grid-cols-[300px_1fr]">
      <div className={`border-cream-300/60 md:block md:border-r ${pacienteId ? 'hidden' : 'block'}`}>
        <ListaPacientes
          seleccionadoId={pacienteId}
          version={version}
          onSeleccionar={setPacienteId}
          onCambio={() => setVersion((v) => v + 1)}
        />
      </div>
      <div className={`min-h-0 flex-col md:flex ${pacienteId ? 'flex' : 'hidden'}`}>
        {pacienteId && (
          <button
            onClick={() => setPacienteId(null)}
            className="px-5 pt-4 text-left text-sm font-medium text-sage-700 md:hidden"
          >
            ← Volver a la lista
          </button>
        )}
        <div className="min-h-0 flex-1">
          <FichaPacientePanel pacienteId={pacienteId} onCambio={() => setVersion((v) => v + 1)} />
        </div>
      </div>
    </div>
  )
}
