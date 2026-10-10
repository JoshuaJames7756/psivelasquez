import { useRef, useState } from 'react'
import { useApiClient } from '../../shared/services/apiClient'
import { useSubirDocumento } from '../hooks/useSubirDocumento'
import type { DocumentoPaciente } from '../../shared/types/db'

export function DocumentosPaciente({
  pacienteId,
  documentosIniciales,
}: {
  pacienteId: string
  documentosIniciales: DocumentoPaciente[]
}) {
  const [documentos, setDocumentos] = useState(documentosIniciales)
  const inputRef = useRef<HTMLInputElement>(null)
  const apiClient = useApiClient()
  const [eliminandoId, setEliminandoId] = useState<string | null>(null)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  const { subir, subiendo, error } = useSubirDocumento(pacienteId, (doc) =>
    setDocumentos((prev) => [doc, ...prev]),
  )

  function manejarSeleccion(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (archivo) subir(archivo)
    e.target.value = '' // permite volver a elegir el mismo archivo después
  }

  async function abrir(doc: DocumentoPaciente) {
    setErrorEliminar(null)
    // La pestaña se abre ya (gesto del clic) para que el navegador no la
    // bloquee; después se le asigna el enlace firmado.
    const pestana = window.open('', '_blank')
    try {
      const { url } = await apiClient.get<{ url: string }>(`/documentos?id=${doc.id}`)
      if (pestana) pestana.location.href = url
      else window.location.href = url
    } catch {
      pestana?.close()
      setErrorEliminar('No se pudo abrir el documento. Intenta de nuevo.')
    }
  }

  async function eliminar(doc: DocumentoPaciente) {
    if (!window.confirm(`¿Eliminar "${doc.nombre}" de la ficha? No se puede deshacer.`)) return
    setEliminandoId(doc.id)
    setErrorEliminar(null)
    try {
      await apiClient.delete('/documentos', { id: doc.id })
      setDocumentos((prev) => prev.filter((d) => d.id !== doc.id))
    } catch {
      setErrorEliminar('No se pudo eliminar el documento. Intenta de nuevo.')
    } finally {
      setEliminandoId(null)
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-sage-800">Documentos</h3>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={subiendo}
          className="text-xs font-medium text-sage-600 underline hover:text-sage-800 disabled:opacity-50"
        >
          {subiendo ? 'Subiendo...' : '+ Adjuntar'}
        </button>
        <input ref={inputRef} type="file" onChange={manejarSeleccion} className="hidden" />
      </div>

      {(error || errorEliminar) && <p className="mb-2 text-xs text-terracotta-600">{error ?? errorEliminar}</p>}

      {documentos.length === 0 ? (
        <p className="text-sm text-sage-500">Sin documentos adjuntos.</p>
      ) : (
        <ul className="space-y-2">
          {documentos.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between gap-3 rounded-2xl bg-cream-100/70 px-3 py-2">
              <button
                onClick={() => abrir(doc)}
                className="min-w-0 truncate text-left text-sm text-sage-800 underline hover:text-sage-900"
              >
                {doc.nombre}
              </button>
              <span
                title={
                  doc.privado
                    ? 'Privado: solo se abre con tu sesión'
                    : 'Enlace público anterior. Para hacerlo privado, elimínalo y vuelve a adjuntarlo.'
                }
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  doc.privado ? 'bg-sage-100 text-sage-700' : 'bg-terracotta-50 text-terracotta-600'
                }`}
              >
                {doc.privado ? 'Privado' : 'Público'}
              </span>
              <button
                onClick={() => eliminar(doc)}
                disabled={eliminandoId === doc.id}
                aria-label={`Eliminar ${doc.nombre}`}
                className="shrink-0 rounded-full px-3 py-1 text-xs font-medium text-terracotta-600 hover:bg-terracotta-50 disabled:opacity-40"
              >
                {eliminandoId === doc.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
