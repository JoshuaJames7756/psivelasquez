// Prerender de las páginas públicas (sin dependencias extra).
// Después de `vite build` (cliente) y `vite build --ssr` (servidor):
//  - escribe dist/<ruta>/index.html con título, metadatos, canonical,
//    Open Graph, datos estructurados y el contenido ya renderizado;
//  - genera dist/sitemap.xml y dist/robots.txt.
// Un fallo en una ruta se avisa pero no tumba el despliegue.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = 'dist'
const servidor = await import(pathToFileURL(join('dist-ssr', 'entry-server.js')).href)
const { render, rutasSeo, seo404, SITE_URL, NOMBRE_SITIO, IMAGEN_SOCIAL, jsonLdInicio } = servidor

const plantilla = await readFile(join(dist, 'index.html'), 'utf8')
const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function cabecera(d, ruta) {
  const url = `${SITE_URL}${ruta === '/' ? '' : ruta}`
  const lineas = [
    `<meta name="description" content="${esc(d.descripcion)}" />`,
    `<meta name="robots" content="${d.noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:locale" content="es_BO" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(NOMBRE_SITIO)}" />`,
    `<meta property="og:title" content="${esc(d.titulo)}" />`,
    `<meta property="og:description" content="${esc(d.descripcion)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${IMAGEN_SOCIAL}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
  if (ruta === '/') {
    lineas.push(`<script type="application/ld+json">${JSON.stringify(jsonLdInicio)}</script>`)
  }
  return lineas.join('\n    ')
}

async function escribirPagina(d, ruta, archivo) {
  const html = render(ruta)
  let salida = plantilla
    .replace(/<title>.*?<\/title>/s, `<title>${esc(d.titulo)}</title>`)
    .replace('<!--seo-->', cabecera(d, ruta))
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  const destino = join(dist, archivo)
  await mkdir(dirname(destino), { recursive: true })
  await writeFile(destino, salida)
}

let ok = 0
for (const d of rutasSeo) {
  try {
    await escribirPagina(d, d.ruta, d.ruta === '/' ? 'index.html' : join(d.ruta, 'index.html'))
    ok++
  } catch (err) {
    console.warn(`[prerender] ADVERTENCIA: no se pudo prerenderizar ${d.ruta}:`, err?.message ?? err)
  }
}
// 404: no se sirve por ruta (Vercel reescribe todo a index.html), pero se
// guarda como 404.html para hosts que lo usan.
try {
  await escribirPagina(seo404, '/ruta-que-no-existe', '404.html')
} catch (err) {
  console.warn('[prerender] ADVERTENCIA: 404.html:', err?.message ?? err)
}

const hoy = new Date().toISOString().slice(0, 10)
const urls = rutasSeo
  .filter((d) => !d.noindex)
  .map((d) => {
    const prioridad = d.ruta === '/' ? '1.0' : d.ruta === '/reservar' ? '0.8' : d.ruta.startsWith('/enfoques/') ? '0.6' : '0.7'
    return `  <url><loc>${SITE_URL}${d.ruta === '/' ? '' : d.ruta}</loc><lastmod>${hoy}</lastmod><priority>${prioridad}</priority></url>`
  })
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
)
await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /sign-in\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
)

console.log(`[prerender] ${ok}/${rutasSeo.length} páginas, sitemap.xml y robots.txt generados (${SITE_URL})`)
if (ok === 0) process.exitCode = 1
