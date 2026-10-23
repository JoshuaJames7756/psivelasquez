import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page, type Route } from '@playwright/test'

/**
 * Recorre todo el panel /admin con Clerk simulado y la API interceptada.
 * Comprueba tres escenarios por pantalla: con datos, sin datos y con la API
 * caída. En todos: sin errores de JavaScript, sin pantalla en blanco.
 */
const sabado = (() => {
  const d = new Date()
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7))
  return d.toISOString().slice(0, 10)
})()
const ahora = new Date().toISOString()

const paciente = {
  id: 'p1', nombre: 'Paciente de Prueba', edad: 29, telefono: '70000000',
  motivo_inicial: 'Estrés laboral', primera_vez: true, estado: 'activo', creado_en: ahora, actualizado_en: ahora,
}
const datos: Record<string, unknown> = {
  '/citas': { slots: [
    { id: 's1', fecha: sabado, hora_inicio: '09:00', modalidad: 'presencial', estado: 'confirmada', paciente_id: 'p1', paciente_nombre: 'Paciente de Prueba', paciente_telefono: '70000000' },
    { id: 's2', fecha: sabado, hora_inicio: '10:00', modalidad: null, estado: 'disponible', paciente_id: null, paciente_nombre: null, paciente_telefono: null },
    { id: 's3', fecha: sabado, hora_inicio: '11:00', modalidad: 'online', estado: 'solicitada', paciente_id: 'p1', paciente_nombre: 'Paciente de Prueba', paciente_telefono: '70000000' },
  ] },
  '/pacientes': { pacientes: [paciente] },
  '/pacientes/p1': {
    paciente,
    historial: [{ id: 'h1', paciente_id: 'p1', slot_id: 's1', motivo: 'Primera sesión', intervencion: 'Psicoeducación', tareas_homework: null, proximos_pasos: 'Registro de sueño', creado_en: ahora, actualizado_en: ahora, tags: [] }],
    escalas: [{ id: 'e1', paciente_id: 'p1', tipo: 'GAD-7', puntaje: 9, aplicada_en: ahora, creado_en: ahora }],
    documentos: [],
  },
  '/tareas': { tareas: [{ id: 't1', titulo: 'Llamar a paciente', descripcion: null, prioridad: 'alta', fecha_limite: sabado, estado: 'todo', paciente_id: null, creado_en: ahora, actualizado_en: ahora }] },
  '/tareas?recurso=notas': { notas: [] },
  '/resumen-mes': { sesionesDadas: 6, pacientesActivos: 4, precioConfigurado: true, ingresoEstimado: 600 },
  '/resumen-mes?finanzas=1': { precioConfigurado: true, precioSesion: 100, sesionesPagadas: 5, ingresoConfirmado: 500, pagosPendientes: 1, pendienteDeCobro: 100 },
  '/seguimiento': {
    solicitadas: [{ id: 's3', fecha: sabado, hora_inicio: '11:00', paciente_nombre: 'Paciente de Prueba', paciente_telefono: '70000000' }],
    confirmadasSinPago: [], pacientesEnRiesgo: [{ id: 'p1', nombre: 'Paciente de Prueba', telefono: '70000000', ultima_cita_confirmada: ahora }],
  },
  '/sitio?recurso=certificaciones': { certificaciones: [{ id: 'c1', institucion: 'Beck Institute', nombre: 'Curso de prueba', anio: 2025, categoria: 'TCC', descripcion: null, documento_url: null, orden: 1, creado_en: ahora }] },
  '/sitio?recurso=redes&todas=1': { publicaciones: [] },
}
const vacio: Record<string, unknown> = {
  '/citas': { slots: [] }, '/pacientes': { pacientes: [] }, '/tareas': { tareas: [] }, '/tareas?recurso=notas': { notas: [] },
  '/resumen-mes': { sesionesDadas: 0, pacientesActivos: 0, precioConfigurado: false, ingresoEstimado: null },
  '/resumen-mes?finanzas=1': { precioConfigurado: false, precioSesion: null, sesionesPagadas: 0, ingresoConfirmado: null, pagosPendientes: 0, pendienteDeCobro: null },
  '/seguimiento': { solicitadas: [], confirmadasSinPago: [], pacientesEnRiesgo: [] },
  '/sitio?recurso=certificaciones': { certificaciones: [] }, '/sitio?recurso=redes&todas=1': { publicaciones: [] },
}

type Escenario = 'datos' | 'vacio' | 'caida'

async function simularApi(page: Page, escenario: Escenario) {
  await page.route('**/api/**', (route: Route) => {
    if (escenario === 'caida') return route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"Error interno"}' })
    const url = new URL(route.request().url())
    const base = url.pathname.replace(/^\/api/, '')
    const clave = base + url.search
    const fuente = escenario === 'datos' ? datos : vacio
    const hallada = fuente[clave] ?? fuente[base] ?? (base.startsWith('/citas') ? fuente['/citas'] : undefined)
    if (route.request().method() !== 'GET') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    if (hallada === undefined) return route.fulfill({ status: 404, contentType: 'application/json', body: '{"error":"No encontrado"}' })
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(hallada) })
  })
}

const pantallas = ['/admin', '/admin/agenda', '/admin/pacientes', '/admin/seguimiento', '/admin/tareas', '/admin/finanzas', '/admin/credenciales', '/admin/contenido']
const esRuido = (t: string) => /clerk|fonts\.g|favicon|net::ERR|status of (500|404)|Failed to load resource/i.test(t)

for (const escenario of ['datos', 'vacio', 'caida'] as const) {
  test.describe(`panel, escenario: ${escenario}`, () => {
    test.setTimeout(120_000)
    test('todas las pantallas cargan sin errores de JavaScript ni pantalla en blanco', async ({ page }) => {
      await simularApi(page, escenario)
      const errores: string[] = []
      page.on('pageerror', (e) => errores.push(e.message))
      page.on('console', (m) => m.type() === 'error' && !esRuido(m.text()) && errores.push(m.text()))
      for (const ruta of pantallas) {
        errores.length = 0
        await page.goto(ruta)
        await expect(page.locator('main, [role="main"]').first(), ruta).toBeVisible({ timeout: 15_000 })
        await page.waitForTimeout(600)
        const texto = (await page.locator('body').innerText()).trim()
        expect(texto.length, `${ruta} quedó en blanco`).toBeGreaterThan(30)
        expect(errores, `${ruta} tiene errores`).toEqual([])
      }
    })
  })
}

test('accesibilidad del panel (axe, WCAG A y AA) con datos', async ({ page }) => {
  test.setTimeout(180_000)
  await simularApi(page, 'datos')
  const hallazgos: string[] = []
  for (const ruta of pantallas) {
    await page.goto(ruta)
    await page.waitForTimeout(1800) // deja terminar las animaciones de entrada
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    for (const v of res.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical'))
      for (const n of v.nodes) { const d = n.any[0]?.data as { fgColor?: string; bgColor?: string; contrastRatio?: number } | undefined; hallazgos.push(`${ruta} | ${v.id} ${d?.contrastRatio ?? ''} ${d?.fgColor ?? ''} sobre ${d?.bgColor ?? ''}: ${n.html.slice(0, 110)}`) }
  }
  expect(hallazgos).toEqual([])
})

for (const ancho of [768, 390]) {
  test(`sin scroll horizontal a ${ancho}px`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width: ancho, height: 900 })
    await simularApi(page, 'datos')
    for (const ruta of pantallas) {
      await page.goto(ruta)
      await page.waitForTimeout(700)
      const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(desborde, `${ruta} a ${ancho}px`).toBeLessThanOrEqual(1)
    }
  })
}

test('pacientes: buscar y abrir la ficha muestra notas y escalas', async ({ page }) => {
  await simularApi(page, 'datos')
  await page.goto('/admin/pacientes')
  await page.getByText('Paciente de Prueba').first().click()
  await expect(page.getByText('Primera sesión').first()).toBeVisible({ timeout: 10_000 })
  await expect(page.getByText(/GAD-7/).first()).toBeVisible()
  await page.waitForTimeout(1500)
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const graves = res.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  expect(graves.map((v) => `${v.id}: ${v.nodes[0]?.html?.slice(0, 120)}`), 'ficha del paciente').toEqual([])
})
