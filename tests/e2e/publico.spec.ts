import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/**
 * Las rutas salen del sitemap.xml generado en el build: si se agrega
 * una página pública nueva, entra sola a estas pruebas.
 */
async function rutasDelSitemap(page: Page): Promise<string[]> {
  const xml = await (await page.request.get('/sitemap.xml')).text()
  const rutas = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  return rutas.map((r) => (r.endsWith('/') ? r : r + '/'))
}

// Errores de terceros (Clerk, fuentes) no dependen de este código.
const esRuido = (t: string) => /clerk|fonts\.g|favicon|net::ERR/i.test(t)

test('el sitemap lista las páginas públicas esperadas', async ({ page }) => {
  const rutas = await rutasDelSitemap(page)
  expect(rutas.length).toBeGreaterThanOrEqual(10)
  expect(rutas).toContain('/')
  expect(rutas).toContain('/reservar/')
  expect(rutas.some((r) => r.startsWith('/admin'))).toBe(false)
})

test('robots.txt bloquea el panel y apunta al sitemap', async ({ page }) => {
  const robots = await (await page.request.get('/robots.txt')).text()
  expect(robots).toMatch(/Disallow: \/admin/)
  expect(robots).toMatch(/Sitemap: https?:\/\//)
})

test.describe('cada página pública', () => {
  test.setTimeout(120_000)
  let rutas: string[] = []
  test.beforeAll(async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    rutas = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
      const p = new URL(m[1]).pathname
      return p.endsWith('/') ? p : p + '/'
    })
  })

  test('carga, tiene un h1, metadatos SEO y cero errores de consola', async ({ page }) => {
    for (const ruta of rutas) {
      const errores: string[] = []
      page.on('pageerror', (e) => errores.push(e.message))
      page.on('console', (m) => m.type() === 'error' && !esRuido(m.text()) && errores.push(m.text()))

      const res = await page.goto(ruta)
      expect(res?.status(), ruta).toBe(200)
      await expect(page.locator('h1'), `${ruta} debe tener un solo h1`).toHaveCount(1)
      expect((await page.title()).length, `${ruta} sin título`).toBeGreaterThan(10)
      await expect(page.locator('meta[name="description"]'), ruta).toHaveAttribute('content', /.{40,}/)
      await expect(page.locator('link[rel="canonical"]'), ruta).toHaveAttribute('href', /^https?:\/\//)
      await expect(page.locator('meta[property="og:image"]').first(), ruta).toHaveAttribute('content', /og-imagen/)
      expect(errores, `${ruta} tiene errores de consola`).toEqual([])
      page.removeAllListeners('pageerror')
      page.removeAllListeners('console')
    }
  })

  test('en móvil (390 px) no hay scroll horizontal', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, isMobile: true })
    const page = await ctx.newPage()
    for (const ruta of rutas) {
      await page.goto(ruta)
      await page.waitForTimeout(400)
      const desborde = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(desborde, `${ruta} se desborda ${desborde}px`).toBeLessThanOrEqual(1)
    }
    await ctx.close()
  })

  test('accesibilidad (axe, WCAG A y AA): sin problemas graves ni críticos', async ({ page }) => {
    const hallazgos: string[] = []
    for (const ruta of rutas) {
      await page.goto(ruta)
      await page.waitForTimeout(600)
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      for (const v of r.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical')) {
        hallazgos.push(`${ruta} | ${v.id} (${v.impact}) | ${v.nodes.length} elementos | ${v.nodes[0]?.target.join(' ')}`)
      }
    }
    expect(hallazgos, hallazgos.join('\n')).toEqual([])
  })
})

test('las páginas con contenido pendiente de Rebeca están en noindex', async ({ page }) => {
  for (const ruta of ['/como-trabajo/', '/aviso-etico/']) {
    await page.goto(ruta)
    await expect(page.locator('meta[name="robots"]'), ruta).toHaveAttribute('content', /noindex/)
  }
})

test('flujo de reserva: elegir cupo, llenar el formulario y confirmar', async ({ page }) => {
  const slot = { id: '123e4567-e89b-12d3-a456-426614174000', fecha: '2026-10-24', hora_inicio: '09:00:00', modalidad: null, estado: 'disponible' }
  let envio: Record<string, unknown> | null = null

  await page.route('**/api/citas**', async (route) => {
    const req = route.request()
    if (req.method() === 'POST') {
      envio = req.postDataJSON()
      return route.fulfill({ status: 201, json: { slot: { id: slot.id, estado: 'solicitada' } } })
    }
    return route.fulfill({ json: { slots: envio ? [{ ...slot, estado: 'solicitada' }] : [slot] } })
  })

  await page.goto('/reservar/')
  await page.getByRole('button', { name: /09:00/ }).first().click()
  const dialogo = page.getByRole('heading', { name: /Reservar 09:00/ })
  await expect(dialogo).toBeVisible()

  // Validación del navegador: el nombre es obligatorio
  await page.getByRole('button', { name: /Solicitar cupo/ }).click()
  expect(envio).toBeNull()

  await page.locator('input[maxlength="120"]').fill('Ana Pérez')
  await page.locator('input[placeholder="+591..."]').fill('+59170000000')
  await page.getByRole('button', { name: 'online' }).click()
  await page.getByRole('button', { name: /Solicitar cupo/ }).click()

  await expect(page.getByText(/Tu cupo quedó solicitado/)).toBeVisible()
  expect(envio).toMatchObject({ slotId: slot.id, nombre: 'Ana Pérez', modalidad: 'online', primeraVez: true, sitioWeb: '' })
})

test('reserva: si la API falla se muestra el error y se puede reintentar', async ({ page }) => {
  const slot = { id: '123e4567-e89b-12d3-a456-426614174000', fecha: '2026-10-24', hora_inicio: '10:00:00', modalidad: null, estado: 'disponible' }
  await page.route('**/api/citas**', (route) =>
    route.request().method() === 'POST'
      ? route.fulfill({ status: 409, json: { error: 'Ese cupo se acaba de reservar, elige otro horario' } })
      : route.fulfill({ json: { slots: [slot] } }),
  )
  await page.goto('/reservar/')
  await page.getByRole('button', { name: /10:00/ }).first().click()
  await page.locator('input[maxlength="120"]').fill('Luis Rojas')
  await page.getByRole('button', { name: /Solicitar cupo/ }).click()
  await expect(page.getByText(/se acaba de reservar/)).toBeVisible()
  await expect(page.getByRole('button', { name: /Solicitar cupo/ })).toBeEnabled()
})

test('la API de la reserva caída muestra un mensaje y no una pantalla vacía', async ({ page }) => {
  await page.route('**/api/citas**', (route) => route.abort())
  await page.goto('/reservar/')
  await expect(page.getByText(/error|no se pudo|inténtalo/i).first()).toBeVisible()
})

test('reserva: con la API caída aparece "Reintentar" y recupera los cupos al volver', async ({ page }) => {
  let caida = true
  const slot = { id: '123e4567-e89b-12d3-a456-426614174000', fecha: '2026-10-24', hora_inicio: '11:00:00', modalidad: null, estado: 'disponible' }
  await page.route('**/api/citas**', (route) => (caida ? route.abort() : route.fulfill({ json: { slots: [slot] } })))
  await page.goto('/reservar/')
  await expect(page.getByRole('alert')).toContainText('No pudimos cargar los cupos')
  caida = false
  await page.getByRole('button', { name: 'Reintentar' }).click()
  await expect(page.getByRole('button', { name: /11:00/ })).toBeVisible()
})

/**
 * Lista de control previa al lanzamiento: solo corre con PRELANZAMIENTO=1
 * (`PRELANZAMIENTO=1 npm run test:e2e`). Falla si queda texto provisional
 * visible en alguna página que sale en Google.
 */
test.describe('antes de lanzar', () => {
  test.skip(!process.env.PRELANZAMIENTO, 'Solo con PRELANZAMIENTO=1')

  test('no hay textos provisionales en páginas indexables', async ({ page }) => {
    const xml = await (await page.request.get('/sitemap.xml')).text()
    const rutas = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
    const hallazgos: string[] = []
    for (const ruta of rutas) {
      await page.goto(ruta)
      const texto = await page.locator('body').innerText()
      for (const patron of [/pendiente/i, /lorem ipsum/i, /próximamente/i, /\bTODO\b/, /por definir/i, /xxx/i]) {
        const m = texto.match(patron)
        if (m) hallazgos.push(`${ruta}: "${m[0]}"`)
      }
    }
    expect(hallazgos, hallazgos.join('\n')).toEqual([])
  })
})
