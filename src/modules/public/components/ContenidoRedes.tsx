import { LineasFondo } from '../../shared/components/LineasFondo'
import { TituloSeccion } from '../../shared/components/TituloSeccion'
import { useRedesPublicas } from '../hooks/useRedesPublicas'

const perfiles = {
  instagram: 'https://instagram.com/psi.rebecavelasquez',
  tiktok: 'https://tiktok.com/@psi.rebecavelasquez',
}

/**
 * Contenido de Instagram/TikTok. Si no hay publicaciones (o falla la
 * API) la sección no se muestra: nada de huecos ni tarjetas falsas.
 * Cada tarjeta abre la publicación original en una pestaña nueva.
 */
export function ContenidoRedes() {
  const { publicaciones, cargando } = useRedesPublicas()
  if (cargando || publicaciones.length === 0) return null

  return (
    <section className="con-grain relative overflow-hidden bg-cream-100 py-16 md:py-20">
      <LineasFondo variante="ondas" className="inset-x-0 top-0 h-40 w-full" />
      <div className="relative mx-auto max-w-6xl px-6">
        <TituloSeccion>Contenido</TituloSeccion>
        <p className="mt-3 max-w-xl text-sage-700">
          Lo que comparto en redes sobre salud mental, para que lo conozcas antes de venir.
        </p>
      </div>

      <ul className="sin-scrollbar relative mx-auto mt-8 flex max-w-6xl snap-x gap-4 overflow-x-auto px-6 pb-2">
        {publicaciones.map((p) => (
          <li key={p.id} className="w-44 shrink-0 snap-start sm:w-52">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl border border-sage-200 bg-cream-50 transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[9/16] bg-sage-100">
                {p.miniatura_url ? (
                  <img
                    src={p.miniatura_url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-sage-200 to-sage-100 font-serif-brand text-3xl italic text-sage-500">
                    {p.plataforma === 'instagram' ? 'IG' : 'TT'}
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded-full bg-cream-50/90 px-2.5 py-0.5 text-xs font-medium text-sage-800">
                  {p.plataforma === 'instagram' ? 'Instagram' : 'TikTok'}
                </span>
              </div>
              <p className="line-clamp-2 min-h-[2.75rem] p-3 text-sm text-sage-800">
                {p.titulo || 'Ver publicación'}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </p>
            </a>
          </li>
        ))}
      </ul>

      <div className="relative mx-auto mt-6 flex max-w-6xl gap-5 px-6 text-sm font-medium">
        <a href={perfiles.instagram} target="_blank" rel="noopener noreferrer" className="text-sage-700 underline hover:text-sage-900">
          Seguir en Instagram
        </a>
        <a href={perfiles.tiktok} target="_blank" rel="noopener noreferrer" className="text-sage-700 underline hover:text-sage-900">
          Seguir en TikTok
        </a>
      </div>
    </section>
  )
}
