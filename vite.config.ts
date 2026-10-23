import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Solo para las pruebas del panel (npm run test:e2e:panel): cambia Clerk por un simulado.
  resolve: process.env.E2E_CLERK_STUB
    ? { alias: { '@clerk/clerk-react': fileURLToPath(new URL('./tests/stubs/clerk.tsx', import.meta.url)) } }
    : undefined,
})
