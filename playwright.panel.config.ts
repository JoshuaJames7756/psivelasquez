import { defineConfig, devices } from '@playwright/test'

/**
 * Pruebas del panel /admin en el navegador, con Clerk simulado y la API
 * interceptada (no necesita cuenta de Clerk, base de datos ni internet).
 * Construye una versión aparte en dist-e2e y la sirve en el puerto 4174.
 */
const PUERTO = Number(process.env.E2E_PANEL_PORT ?? 4174)
const chromium = process.env.PLAYWRIGHT_CHROMIUM_PATH

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: /panel\.spec\.ts/,
  timeout: 60_000,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: `http://127.0.0.1:${PUERTO}`, trace: 'retain-on-failure' },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions: chromium ? { executablePath: chromium, args: ['--no-sandbox'] } : {} },
    },
  ],
  webServer: process.env.E2E_SIN_SERVIDOR
    ? undefined
    : {
        command: `npx vite build --outDir dist-e2e --emptyOutDir && npx vite preview --outDir dist-e2e --host 127.0.0.1 --port ${PUERTO} --strictPort`,
        url: `http://127.0.0.1:${PUERTO}/admin`,
        reuseExistingServer: true,
        timeout: 180_000,
        env: { E2E_CLERK_STUB: '1', VITE_CLERK_PUBLISHABLE_KEY: 'pk_test_ZHVtbXkuY2xlcmsuYWNjb3VudHMuZGV2JA' },
      },
})
