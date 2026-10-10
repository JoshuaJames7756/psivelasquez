import { useEffect } from 'react'
import { IMAGEN_SOCIAL, NOMBRE_SITIO, SITE_URL, type DatosSeo } from './sitio'

function poner(selector: string, crear: () => HTMLElement, atributo: string, valor: string) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = crear()
    document.head.appendChild(el)
  }
  el.setAttribute(atributo, valor)
}

const meta = (clave: 'name' | 'property', nombre: string, contenido: string) =>
  poner(
    `meta[${clave}="${nombre}"]`,
    () => {
      const m = document.createElement('meta')
      m.setAttribute(clave, nombre)
      return m
    },
    'content',
    contenido,
  )

/**
 * Actualiza título y metadatos al navegar dentro de la app. El HTML
 * inicial (lo que leen Google y WhatsApp) lo genera el prerender del
 * build con los mismos datos; esto mantiene la pestaña y el historial
 * coherentes en la navegación del lado del cliente.
 */
export function useSeo(datos: Pick<DatosSeo, 'titulo' | 'descripcion' | 'ruta' | 'noindex'>) {
  const { titulo, descripcion, ruta, noindex } = datos
  useEffect(() => {
    const url = `${SITE_URL}${ruta === '/' ? '' : ruta}`
    document.title = titulo
    meta('name', 'description', descripcion)
    meta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    poner('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', url)
    meta('property', 'og:title', titulo)
    meta('property', 'og:description', descripcion)
    meta('property', 'og:url', url)
    meta('property', 'og:type', 'website')
    meta('property', 'og:site_name', NOMBRE_SITIO)
    meta('property', 'og:image', IMAGEN_SOCIAL)
    meta('name', 'twitter:card', 'summary_large_image')
  }, [titulo, descripcion, ruta, noindex])
}
