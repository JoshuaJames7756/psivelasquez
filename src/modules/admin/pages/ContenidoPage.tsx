import { useRef, useState } from 'react'
import { useRedes } from '../hooks/useRedes'
import { botonPrimario, botonSecundario, campo, tarjeta } from '../utils/estilos'

export function ContenidoPage() {
  const { publicaciones, cargando, guardando, error, crear, cambiarVisible, eliminar } = useRedes()
  const [plataforma, setPlataforma] = useState<'instagram' | 'tiktok'>('instagram')
  const [url, setUrl] = useState('')
  const [titulo, setTitulo] = useState('')
  const [miniatura, setMiniatura] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    const ok = await crear({
      plataforma,
      url: url.trim(),
      titulo: titulo.trim() || undefined,
      miniatura: miniatura ?? undefined,
    })
    if (ok) {
      setUrl('')
      setTitulo('')
      setMiniatura(null)
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif-brand text-3xl text-sage-900">Contenido en redes</h1>
        <p className="mt-1 max-w-2xl text-sm text-sage-700">
        Lo que agregues aparece en la sección "Contenido" de la página de inicio. Las más nuevas
        van primero. Pega el enlace de la publicación y, si quieres, sube una captura como
        miniatura.
        </p>
      </header>

      <form
        onSubmit={enviar}
        className={`${tarjeta} max-w-lg space-y-3 p-5`}
      >
        <div className="flex gap-2" role="group" aria-label="Red social">
          {(['instagram', 'tiktok'] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={plataforma === p}
              onClick={() => setPlataforma(p)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                plataforma === p
                  ? 'bg-sage-700 text-sage-900'
                  : 'border border-sage-300 text-sage-800 hover:bg-sage-50'
              }`}
            >
              {p === 'instagram' ? 'Instagram' : 'TikTok'}
            </button>
          ))}
        </div>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enlace de la publicación (https://...)"
          aria-label="Enlace de la publicación"
          className={campo}
        />
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título corto (opcional)"
          aria-label="Título"
          maxLength={90}
          className={campo}
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={botonSecundario}
          >
            {miniatura ? 'Cambiar miniatura' : 'Elegir miniatura (imagen)'}
          </button>
          {miniatura && <span className="truncate text-sm text-sage-700">{miniatura.name}</span>}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setMiniatura(e.target.files?.[0] ?? null)}
          />
        </div>
        {error && <p className="text-xs text-terracotta-600">{error}</p>}
        <button
          type="submit"
          disabled={guardando}
          className={botonPrimario}
        >
          {guardando ? 'Guardando...' : 'Agregar publicación'}
        </button>
      </form>

      <div className="max-w-2xl space-y-2">
        {cargando ? (
          <p className="text-sage-700">Cargando...</p>
        ) : publicaciones.length === 0 ? (
          <p className="text-sm text-sage-700">Aún no hay publicaciones. Agrega la primera arriba.</p>
        ) : (
          publicaciones.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-cream-300/70 bg-cream-50 p-3 shadow-sm"
            >
              {p.miniatura_url ? (
                <img src={p.miniatura_url} alt="" className="h-14 w-11 rounded object-cover" />
              ) : (
                <div className="h-14 w-11 rounded bg-cream-200" aria-hidden="true" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-sage-900">{p.titulo || p.url}</p>
                <p className="text-xs text-sage-700">
                  {p.plataforma === 'instagram' ? 'Instagram' : 'TikTok'}
                  {p.visible ? '' : ' · oculta'}
                </p>
              </div>
              <button
                onClick={() => cambiarVisible(p.id, !p.visible)}
                className="text-xs text-sage-700 hover:underline"
              >
                {p.visible ? 'Ocultar' : 'Mostrar'}
              </button>
              <button
                onClick={() => {
                  if (window.confirm('¿Eliminar esta publicación?')) eliminar(p.id)
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
