import { useState } from 'react'
import { useApiClient } from '../../../shared/services/apiClient'
import { botonSecundario } from '../../utils/estilos'

type Tipo = 'pacientes' | 'sesiones'

/**
 * Descarga de respaldo en CSV (abre en Excel o Google Sheets). Las
 * notas de sesión son contenido clínico completo, por eso se pide
 * confirmación y el servidor deja un registro de auditoría.
 */
export function ExportarDatos() {
  const apiClient = useApiClient()
  const [abierto, setAbierto] = useState(false)
  const [descargando, setDescargando] = useState<Tipo | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function exportar(tipo: Tipo) {
    if (
      tipo === 'sesiones' &&
      !window.confirm(
        'Este archivo contiene las notas clínicas completas. Guárdalo en un lugar seguro y bórralo cuando ya no lo necesites. ¿Descargar?',
      )
    ) {
      return
    }
    setDescargando(tipo)
    setError(null)
    try {
      const blob = await apiClient.descargar(`/pacientes?exportar=${tipo}`)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tipo}-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo descargar')
    } finally {
      setDescargando(null)
    }
  }

  return (
    <div className="border-t border-cream-300/60 px-4 py-3">
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="text-xs font-medium text-sage-700 hover:underline"
      >
        {abierto ? 'Ocultar respaldo' : 'Descargar respaldo (CSV)'}
      </button>
      {abierto && (
        <div className="mt-2 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button className={botonSecundario} disabled={descargando !== null} onClick={() => exportar('pacientes')}>
              {descargando === 'pacientes' ? 'Descargando...' : 'Pacientes'}
            </button>
            <button className={botonSecundario} disabled={descargando !== null} onClick={() => exportar('sesiones')}>
              {descargando === 'sesiones' ? 'Descargando...' : 'Notas de sesión'}
            </button>
          </div>
          <p className="text-xs text-sage-600">Se abre en Excel o Google Sheets. Queda registrado quién descargó.</p>
          {error && <p className="text-xs text-terracotta-600">{error}</p>}
        </div>
      )}
    </div>
  )
}
