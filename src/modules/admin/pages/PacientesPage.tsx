import { useState } from 'react'
import { BuscadorPacientes } from '../components/BuscadorPacientes'
import { FichaPacientePanel } from '../components/FichaPacientePanel'

export function PacientesPage() {
  const [pacienteId, setPacienteId] = useState<string | null>(null)

  return (
    <div className="grid h-screen grid-cols-[280px_1fr]">
      <BuscadorPacientes onSeleccionar={setPacienteId} pacienteSeleccionadoId={pacienteId} />
      <FichaPacientePanel pacienteId={pacienteId} />
    </div>
  )
}
