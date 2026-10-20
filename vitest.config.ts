import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    // Variables falsas: los módulos del servidor exigen estas claves al cargarse.
    env: {
      DATABASE_URL: 'postgres://prueba:prueba@localhost/prueba',
      CLERK_SECRET_KEY: 'sk_test_falsa',
      CLERK_PUBLISHABLE_KEY: 'pk_test_falsa',
      CLOUDINARY_CLOUD_NAME: 'prueba',
      CLOUDINARY_API_KEY: '123',
      CLOUDINARY_API_SECRET: 'secreto',
    },
  },
})
