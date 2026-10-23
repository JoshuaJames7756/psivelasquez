import { defineConfig, devices } from '@playwright/test'

/**
 * Pruebas de navegador sobre el build de producción (con las páginas
 * prerenderizadas), servido con `vite preview`.
 *
 * Requiere VITE_CLERK_PUBLISHABLE_KEY en .env.local (como el resto del
 * proyecto). La primera vez: `npx playwright install chromium`.
 */
const PUERTO = Number(process.env.E2E_PORT ?? 4173)

export default defineConfig({
  testDir: 'tests/e2e',
  testIgnore: /panel\.spec\.ts/, // el panel tiene su propia configuración (playwright.panel.config.ts)
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PUERTO}`,
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH, args: ['--no-sandbox'] }
      : {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.E2E_SIN_SERVIDOR
    ? undefined
    : {
        command: `npm run build && npx vite preview --host 127.0.0.1 --port ${PUERTO} --strictPort`,
        url: `http://127.0.0.1:${PUERTO}/`,
        reuseExistingServer: true,
        timeout: 180_000,
      },
})
