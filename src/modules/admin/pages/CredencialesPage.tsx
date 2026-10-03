import { useRef, useState } from 'react'
import { useCertificaciones } from '../hooks/useCertificaciones'

export function CredencialesPage() {
  const { certificaciones, cargando, guardando, error, crear, eliminar } = useCertificaciones()
  const [institucion, setInstitucion] = useState('')
  const [nombre, setNombre] = useState('')
  const [anio, setAnio] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const inputArchivoRef = useRef<HTMLInputElement>(null)

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!institucion.trim() || !nombre.trim()) return
    await crear({
      institucion: institucion.trim(),
      nombre: nombre.trim(),
      anio: anio ? Number(anio) : undefined,
      archivo: archivo ?? undefined,
    })
    setInstitucion('')
    setNombre('')
    setAnio('')
    setArchivo(null)
  }

  return (
    <section className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-cream-50">Credenciales</h1>
      <p className="mt-1 text-sm text-cream-300">
        Se muestran en /formacion del sitio público, en el orden en que las agregues.
      </p>

      <form
        onSubmit={manejarSubmit}
        className="mt-6 max-w-lg space-y-3 rounded-xl border border-forest-700 bg-forest-800 p-5"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={institucion}
            onChange={(e) => setInstitucion(e.target.value)}
            placeholder="Institución"
            className="rounded-lg border border-forest-700 bg-forest-900 px-3 py-2 text-sm text-cream-50 placeholder:text-cream-300/50 focus:border-sage-500 focus:outline-none"
          />
          <input
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            placeholder="Año"
            type="number"
            className="rounded-lg border border-forest-700 bg-forest-900 px-3 py-2 text-sm text-cream-50 placeholder:text-cream-300/50 focus:border-sage-500 focus:outline-none"
          />
        </div>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la certificación"
          className="w-full rounded-lg border border-forest-700 bg-forest-900 px-3 py-2 text-sm text-cream-50 placeholder:text-cream-300/50 focus:border-sage-500 focus:outline-none"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputArchivoRef.current?.click()}
            className="rounded-lg border border-sage-500 px-4 py-2 text-sm font-medium text-sage-300 hover:bg-sage-500/10"
          >
            {archivo ? 'Cambiar archivo' : 'Elegir archivo (PDF o imagen)'}
          </button>
          {archivo && <span className="truncate text-sm text-cream-300">{archivo.name}</span>}
          <input
            ref={inputArchivoRef}
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </div>
        {error && <p className="text-xs text-terracotta-300">{error}</p>}
        <button
          type="submit"
          disabled={guardando}
          className="rounded-lg bg-sage-700 px-4 py-2 text-sm font-medium text-cream-50 hover:bg-sage-800 disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : 'Agregar certificación'}
        </button>
      </form>

      <div className="mt-8 space-y-2">
        {cargando ? (
          <p className="text-cream-300">Cargando...</p>
        ) : (
          certificaciones.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-forest-700 bg-forest-800 p-3"
            >
              <div>
                <p className="text-sm text-cream-50">{c.nombre}</p>
                <p className="text-xs text-cream-300">
                  {c.institucion}
                  {c.anio ? ` · ${c.anio}` : ''}
                  {c.documento_url ? ' · con documento' : ' · sin documento'}
                </p>
              </div>
              <button
                onClick={() => eliminar(c.id)}
                className="text-xs text-terracotta-300 hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
