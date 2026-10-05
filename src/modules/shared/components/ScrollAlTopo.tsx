import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * BrowserRouter simple (no el modo Framework/Data) no trae scroll
 * restoration automático — <ScrollRestoration> de react-router-dom
 * solo existe en ese modo. Esto replica el comportamiento esperado:
 * nueva ruta → scroll al top; link con #ancla en la misma navegación
 * → deja que el navegador baje a esa sección en vez de interferir.
 */
export function ScrollAlTopo() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return // el navegador ya maneja el scroll al #ancla

    const prefiereReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, left: 0, behavior: prefiereReducido ? 'auto' : 'instant' })
  }, [pathname, hash])

  return null
}
