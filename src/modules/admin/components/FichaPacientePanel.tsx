import { useState } from 'react'
import type { Paciente } from '../../shared/types/db'
import { colorAvatar, inicialesNombre } from '../../shared/utils/avatarColor'
import { useAccionesPaciente } from '../hooks/useAccionesPaciente'
import { useFichaPaciente } from '../hooks/useFichaPaciente'
import { exportarFicha } from '../utils/exportarFicha'
import { DocumentosPaciente } from './DocumentosPaciente'
import { GraficoEscalas } from './GraficoEscalas'
import { NotaSesion } from './pacientes/NotaSesion'

const campo =
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-sage-900 focus:border-sage-500 focus:outline-none'

function EditarDatos({
  paciente,
  onGuardado,
  onCancelar,
}: {
  paciente: Paciente
  onGuardado: () => void
  onCancelar: () => void
}) {
  const { editarPaciente } = useAccionesPaciente()
  const [nombre, setNombre] = useState(paciente.nombre)
  const [edad, setEdad] = useState(paciente.edad?.toString() ?? '')
  const [telefono, setTelefono] = useState(paciente.telefono ?? '')
  const [motivo, setMotivo] = useState(paciente.motivo_inicial ?? '')
  const [estado, setEstado] = useState(paciente.estado)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      await editarPaciente(paciente.id, {
        nombre,
        edad: edad ? Number(edad) : null,
        telefono: telefono.trim() || null,
        motivoInicial: motivo.trim() || null,
        estado,
      })
      onGuardado()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="mt-4 space-y-3 rounded-3xl border border-sage-200 bg-sage-50 p-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} aria-label="Nombre" required className={campo} />
        <input value={edad} onChange={(e) => setEdad(e.target.value)} type="number" min={0} max={120} aria-label="Edad" placeholder="Edad" className={campo} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} aria-label="Teléfono" placeholder="Teléfono con código de país" className={campo} />
        <select value={estado} onChange={(e) => setEstado(e.target.value as Paciente['estado'])} aria-label="Estado" className={campo}>
          <option value="activo">Activo</option>
          <option value="pausado">Pausado</option>
          <option value="alta">De alta</option>
        </select>
      </div>
      <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} aria-label="Motivo inicial" placeholder="Motivo inicial de consulta" rows={2} className={campo} />
      {error && <p className="text-xs text-terracotta-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={guardando} className="rounded-full bg-sage-700 px-4 py-1.5 text-sm font-medium text-cream-50 hover:bg-sage-800 disabled:opacity-50">
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button type="button" onClick={onCancelar} className="rounded-full px-3 py-1.5 text-sm text-sage-700 hover:bg-sage-100">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function FichaPacientePanel({
  pacienteId,
  onCambio,
}: {
  pacienteId: string | null
  onCambio: () => void
}) {
  const { ficha, cargando, recargar } = useFichaPaciente(pacienteId)
  const { crearNota, eliminarNota } = useAccionesPaciente()
  const [editando, setEditando] = useState(false)
  const [creandoNota, setCreandoNota] = useState(false)
  const [recienCreadaId, setRecienCreadaId] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  if (!pacienteId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="font-serif-brand text-xl text-sage-800">Elige un paciente</p>
        <p className="max-w-xs text-sm text-sage-600">
          Busca por nombre en la lista o crea uno nuevo con el botón +.
        </p>
      </div>
    )
  }

  if (cargando || !ficha) {
    return (
      <div className="space-y-4 p-8" aria-busy="true">
        <div className="h-14 w-64 animate-pulse rounded-2xl bg-sage-100" />
        <div className="h-40 animate-pulse rounded-3xl bg-sage-100" />
      </div>
    )
  }

  const { paciente, historial, escalas, documentos } = ficha

  async function nuevaNota() {
    setCreandoNota(true)
    setAviso(null)
    try {
      const { nota } = await crearNota(paciente.id)
      setRecienCreadaId(nota.id)
      recargar(true)
    } catch {
      setAviso('No se pudo crear la nota. Intenta de nuevo.')
    } finally {
      setCreandoNota(false)
    }
  }

  async function borrar(id: string) {
    if (!window.confirm('¿Eliminar esta nota de sesión? No se puede deshacer.')) return
    try {
      await eliminarNota(paciente.id, id)
      recargar(true)
    } catch {
      setAviso('No se pudo eliminar la nota.')
    }
  }

  function exportar(soloNotaId?: string) {
    if (!exportarFicha(ficha!, soloNotaId)) {
      setAviso('El navegador bloqueó la ventana. Permite ventanas emergentes para este sitio.')
    }
  }

  return (
    <div className="h-full min-w-0 overflow-y-auto p-5 md:p-8">
      <div className="flex flex-wrap items-center gap-4">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-cream-50 ${colorAvatar(paciente.id)}`}>
          {inicialesNombre(paciente.nombre)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-serif-brand truncate text-2xl text-sage-900">{paciente.nombre}</h2>
          <p className="text-sm text-sage-600">
            {paciente.edad ? `${paciente.edad} años · ` : ''}
            {paciente.estado === 'activo' ? 'Activo' : paciente.estado === 'pausado' ? 'Pausado' : 'De alta'}
            {paciente.telefono ? ` · ${paciente.telefono}` : ''}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button onClick={() => setEditando((v) => !v)} className="rounded-full border border-sage-300 px-4 py-1.5 font-medium text-sage-800 hover:bg-sage-50">
            Editar datos
          </button>
          <button onClick={() => exportar()} className="rounded-full bg-sage-700 px-4 py-1.5 font-medium text-cream-50 hover:bg-sage-800">
            Exportar PDF
          </button>
        </div>
      </div>

      {paciente.motivo_inicial && !editando && (
        <p className="mt-3 rounded-2xl bg-cream-200/60 px-4 py-2 text-sm text-sage-800">
          <span className="font-medium">Motivo inicial:</span> {paciente.motivo_inicial}
        </p>
      )}

      {editando && (
        <EditarDatos
          paciente={paciente}
          onCancelar={() => setEditando(false)}
          onGuardado={() => {
            setEditando(false)
            recargar(true)
            onCambio()
          }}
        />
      )}

      {aviso && (
        <p role="alert" className="mt-4 rounded-2xl bg-terracotta-50 px-4 py-2 text-sm text-terracotta-600">
          {aviso}
        </p>
      )}

      <div className="mt-8 space-y-8">
        <section aria-labelledby="titulo-historial">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 id="titulo-historial" className="font-serif-brand text-xl text-sage-900">
              Historial de sesiones
            </h3>
            <button
              onClick={nuevaNota}
              disabled={creandoNota}
              className="rounded-full bg-terracotta-500 px-4 py-1.5 text-sm font-medium text-cream-50 hover:bg-terracotta-600 disabled:opacity-50"
            >
              {creandoNota ? 'Creando...' : '+ Nueva nota de sesión'}
            </button>
          </div>

          {historial.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-cream-300 p-8 text-center">
              <p className="text-sm text-sage-700">Este paciente todavía no tiene notas de sesión.</p>
              <p className="mt-1 text-xs text-sage-600">
                Crea la primera con el botón de arriba y escribe: se guarda sola.
              </p>
            </div>
          ) : (
            <ol className="relative space-y-4 border-l-2 border-sage-200 pl-0">
              {historial.map((h) => (
                <NotaSesion
                  key={h.id}
                  registro={h}
                  abiertaInicial={historial.length === 1 || h.id === recienCreadaId}
                  onExportar={() => exportar(h.id)}
                  onEliminar={() => borrar(h.id)}
                />
              ))}
            </ol>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-cream-300/70 bg-cream-50 p-5 shadow-sm">
            <h3 className="font-serif-brand mb-3 text-xl text-sage-900">Escalas de seguimiento</h3>
            <GraficoEscalas pacienteId={paciente.id} escalasIniciales={escalas} />
          </section>
          <section className="rounded-3xl border border-cream-300/70 bg-cream-50 p-5 shadow-sm">
            <DocumentosPaciente pacienteId={paciente.id} documentosIniciales={documentos} />
          </section>
        </div>
      </div>
    </div>
  )
}
