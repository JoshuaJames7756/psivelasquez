import { useRef, useState } from 'react'
import { useCertificaciones } from '../hooks/useCertificaciones'
import { botonPrimario, botonSecundario, campo, tarjeta } from '../utils/estilos'

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
    <section className="space-y-6">
      <header>
        <h1 className="font-serif-brand text-3xl text-sage-900">Credenciales</h1>
        <p className="mt-1 text-sm text-sage-700">
          Se muestran en la página de formación del sitio público, en el orden en que las agregues.
        </p>
      </header>

      <form
        onSubmit={manejarSubmit}
        className={`${tarjeta} max-w-lg space-y-3 p-5`}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={institucion}
            onChange={(e) => setInstitucion(e.target.value)}
            placeholder="Institución"
            className={campo}
          />
          <input
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            placeholder="Año"
            type="number"
            className={campo}
          />
        </div>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la certificación"
          className={campo}
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputArchivoRef.current?.click()}
            className={botonSecundario}
          >
            {archivo ? 'Cambiar archivo' : 'Elegir archivo (PDF o imagen)'}
          </button>
          {archivo && <span className="truncate text-sm text-sage-700">{archivo.name}</span>}
          <input
            ref={inputArchivoRef}
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </div>
        {error && <p className="text-xs text-terracotta-600">{error}</p>}
        <button
          type="submit"
          disabled={guardando}
          className={botonPrimario}
        >
          {guardando ? 'Guardando...' : 'Agregar certificación'}
        </button>
      </form>

      <div className="max-w-2xl space-y-2">
        {cargando ? (
          <p className="text-sage-700">Cargando...</p>
        ) : (
          certificaciones.length === 0 ? (
            <p className="text-sm text-sage-700">Aún no hay certificaciones. Agrega la primera arriba.</p>
          ) : certificaciones.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-cream-300/70 bg-cream-50 p-3 shadow-sm"
            >
              <div>
                <p className="text-sm text-sage-900">{c.nombre}</p>
                <p className="text-xs text-sage-700">
                  {c.institucion}
                  {c.anio ? ` · ${c.anio}` : ''}
                  {c.documento_url ? ' · con documento' : ' · sin documento'}
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('¿Eliminar esta certificación?')) eliminar(c.id)
                }}
                className="text-xs text-terracotta-600 hover:underline"
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
