import { renderToString } from 'react-dom/server'
import { Routes, StaticRouter } from 'react-router-dom'
import { rutasPublicas } from './modules/public/RutasPublicas'

/** Solo lo usa el prerender del build (scripts/prerender.mjs). */
export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <Routes>{rutasPublicas()}</Routes>
    </StaticRouter>,
  )
}

export { IMAGEN_SOCIAL, NOMBRE_SITIO, SITE_URL, jsonLdInicio, rutasSeo, seo404 } from './modules/shared/seo/sitio'
