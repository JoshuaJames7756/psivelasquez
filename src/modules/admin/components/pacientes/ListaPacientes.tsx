import { useState } from 'react'
import { colorAvatar, inicialesNombre } from '../../../shared/utils/avatarColor'
import { useAccionesPaciente } from '../../hooks/useAccionesPaciente'
import { useBusquedaPacientes } from '../../hooks/useBusquedaPacientes'

const campo =
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-sage-900 placeholder:text-sage-500 focus:border-sage-500 focus:outline-none'

const etiquetaEstado = { activo: 'Activo', pausado: 'Pausado', alta: 'De alta' } as const

function NuevoPaciente({ onCreado, onCancelar }: { onCreado: (id: string) => void; onCancelar: () => void }) {
  const { crearPaciente } = useAccionesPaciente()
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [telefono, setTelefono] = useState('')
  const [motivo, setMotivo] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      const { paciente } = await crearPaciente({
        nombre,
        edad: edad ? Number(edad) : null,
        telefono: telefono.trim() || undefined,
        motivoInicial: motivo.trim() || undefined,
      })
      onCreado(paciente.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el paciente')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-2 rounded-2xl border border-sage-200 bg-sage-50 p-3">
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" aria-label="Nombre completo" required minLength={2} className={campo} />
      <div className="grid grid-cols-[5rem_1fr] gap-2">
        <input value={edad} onChange={(e) => setEdad(e.target.value)} type="number" min={0} max={120} placeholder="Edad" aria-label="Edad" className={campo} />
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono (con código)" aria-label="Teléfono" className={campo} />
      </div>
      <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Motivo de consulta (opcional)" aria-label="Motivo de consulta" className={campo} />
      {error && <p className="text-xs text-terracotta-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={guardando} className="rounded-full bg-sage-700 px-4 py-1.5 text-sm font-medium text-cream-50 hover:bg-sage-800 disabled:opacity-50">
          {guardando ? 'Creando...' : 'Crear paciente'}
        </button>
        <button type="button" onClick={onCancelar} className="rounded-full px-3 py-1.5 text-sm text-sage-700 hover:bg-sage-100">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function ListaPacientes({
  seleccionadoId,
  version,
  onSeleccionar,
  onCambio,
}: {
  seleccionadoId: string | null
  version: number
  onSeleccionar: (id: string) => void
  onCambio: () => void
}) {
  const [termino, setTermino] = useState('')
  const [creando, setCreando] = useState(false)
  const { resultados, cargando } = useBusquedaPacientes(termino, version)

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 p-4">
        <div className="flex gap-2">
          <input
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder="Buscar paciente..."
            aria-label="Buscar paciente"
            className={campo}
          />
          <button
            onClick={() => setCreando((v) => !v)}
            aria-expanded={creando}
            aria-label="Nuevo paciente"
            className="shrink-0 rounded-xl bg-sage-700 px-3 text-lg leading-none text-cream-50 hover:bg-sage-800"
          >
            +
          </button>
        </div>
        {creando && (
          <NuevoPaciente
            onCancelar={() => setCreando(false)}
            onCreado={(id) => {
              setCreando(false)
              onCambio()
              onSeleccionar(id)
            }}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {cargando && <p className="px-3 text-sm text-sage-600">Buscando...</p>}
        {!cargando && resultados.length === 0 && (
          <p className="px-3 text-sm text-sage-600">
            {termino ? 'Sin resultados.' : 'Aún no hay pacientes. Usa + para agregar el primero.'}
          </p>
        )}
        <ul>
          {resultados.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => onSeleccionar(p.id)}
                aria-current={seleccionadoId === p.id}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-sage-100 ${
                  seleccionadoId === p.id ? 'bg-sage-100' : ''
                }`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-cream-50 ${colorAvatar(p.id)}`}>
                  {inicialesNombre(p.nombre)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-sage-900">{p.nombre}</span>
                  <span className="block text-xs text-sage-600">
                    {etiquetaEstado[p.estado]}
                    {p.primera_vez ? ' · Primera vez' : ''}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
