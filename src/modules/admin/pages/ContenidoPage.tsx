import { useRef, useState } from 'react'
import { useRedes } from '../hooks/useRedes'

const campo =
  'w-full rounded-lg border border-forest-700 bg-forest-900 px-3 py-2 text-sm text-cream-50 placeholder:text-cream-300/50 focus:border-sage-500 focus:outline-none'

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
    <section className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-cream-50">Contenido en redes</h1>
      <p className="mt-1 text-sm text-cream-300">
        Lo que agregues aparece en la sección "Contenido" de la página de inicio. Las más nuevas
        van primero. Pega el enlace de la publicación y, si quieres, sube una captura como
        miniatura.
      </p>

      <form
        onSubmit={enviar}
        className="mt-6 max-w-lg space-y-3 rounded-xl border border-forest-700 bg-forest-800 p-5"
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
                  ? 'bg-sage-700 text-cream-50'
                  : 'border border-forest-700 text-cream-300 hover:text-cream-50'
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
            className="rounded-lg border border-sage-500 px-4 py-2 text-sm font-medium text-sage-300 hover:bg-sage-500/10"
          >
            {miniatura ? 'Cambiar miniatura' : 'Elegir miniatura (imagen)'}
          </button>
          {miniatura && <span className="truncate text-sm text-cream-300">{miniatura.name}</span>}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setMiniatura(e.target.files?.[0] ?? null)}
          />
        </div>
        {error && <p className="text-xs text-terracotta-300">{error}</p>}
        <button
          type="submit"
          disabled={guardando}
          className="rounded-lg bg-sage-700 px-4 py-2 text-sm font-medium text-cream-50 hover:bg-sage-800 disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : 'Agregar publicación'}
        </button>
      </form>

      <div className="mt-8 max-w-2xl space-y-2">
        {cargando ? (
          <p className="text-cream-300">Cargando...</p>
        ) : publicaciones.length === 0 ? (
          <p className="text-sm text-cream-300">Aún no hay publicaciones. Agrega la primera arriba.</p>
        ) : (
          publicaciones.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-lg border border-forest-700 bg-forest-800 p-3"
            >
              {p.miniatura_url ? (
                <img src={p.miniatura_url} alt="" className="h-14 w-11 rounded object-cover" />
              ) : (
                <div className="h-14 w-11 rounded bg-forest-900" aria-hidden="true" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-cream-50">{p.titulo || p.url}</p>
                <p className="text-xs text-cream-300">
                  {p.plataforma === 'instagram' ? 'Instagram' : 'TikTok'}
                  {p.visible ? '' : ' · oculta'}
                </p>
              </div>
              <button
                onClick={() => cambiarVisible(p.id, !p.visible)}
                className="text-xs text-sage-300 hover:underline"
              >
                {p.visible ? 'Ocultar' : 'Mostrar'}
              </button>
              <button
                onClick={() => {
                  if (window.confirm('¿Eliminar esta publicación?')) eliminar(p.id)
                }}
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
