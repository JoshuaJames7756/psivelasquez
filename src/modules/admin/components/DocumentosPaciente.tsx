import { useRef, useState } from 'react'
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

  const { subir, subiendo, error } = useSubirDocumento(pacienteId, (doc) =>
    setDocumentos((prev) => [doc, ...prev]),
  )

  function manejarSeleccion(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (archivo) subir(archivo)
    e.target.value = '' // permite volver a elegir el mismo archivo después
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

      {error && <p className="mb-2 text-xs text-terracotta-600">{error}</p>}

      {documentos.length === 0 ? (
        <p className="text-sm text-sage-500">Sin documentos adjuntos.</p>
      ) : (
        <ul className="space-y-2">
          {documentos.map((doc) => (
            <li key={doc.id}>
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-sage-700 underline hover:text-sage-900"
              >
                {doc.nombre}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
