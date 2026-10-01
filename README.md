# Rebeca Velásquez — Sitio + Panel Clínico

Xion Technology. Sitio público y panel administrativo (`/admin`) como una
sola aplicación React + Vite, con backend serverless en `/api` sobre Neon
(Postgres) y autenticación con Clerk.

## Primer arranque

```bash
npm install
cp .env.example .env.local   # completar DATABASE_URL, CLERK_*, VITE_CLERK_*
npm run dev
```

`npm run dev` corre `vercel dev`, NO `vite` solo. Esto es necesario porque
el sitio depende de las funciones serverless de `/api` (citas, pacientes,
historial, etc.) — Vite por sí solo no las ejecuta, y pedir `/api/algo`
sin `vercel dev` devuelve el HTML de la SPA en vez de JSON, lo que rompe
cualquier fetch.

La primera vez que corras `npm run dev`, la CLI de Vercel va a pedirte
vincular la carpeta a un proyecto de Vercel (nuevo o existente) — es
necesario para que sepa cómo levantar `/api` localmente.

Si solo necesitás trabajar en el frontend sin tocar nada que dependa de
`/api` (ej. ajustes de estilos en una sección estática), podés usar
`npm run dev:vite-only`, más rápido de levantar pero sin backend.

## Generar los slots del próximo sábado (primera vez)

Las tablas empiezan vacías. Los slots del sábado se generan automáticamente
vía Vercel Cron (`vercel.json`, `/api/cron/generar-slots`), pero los cron
jobs de Vercel **solo corren en producción**. Para generarlos manualmente
en desarrollo o antes del primer deploy, visitá una vez:

```
http://localhost:3000/api/cron/generar-slots
```

(el puerto de `vercel dev` suele ser 3000, no 5173 — confirmar en la
consola al levantar el servidor)

## Scripts

- `npm run dev` — Vite + funciones `/api` vía Vercel CLI
- `npm run dev:vite-only` — solo frontend, sin `/api`
- `npm run build` — build de producción del frontend
- `npm run typecheck:api` — tipa `/api` por separado (el build del
  frontend no lo cubre, ver `tsconfig.api.json`)

## Migraciones de base de datos

`db/migrations/`, en orden numérico. `001` y `003` son obligatorias;
`002` es opcional (búsqueda difusa de pacientes por nombre, solo si hace
falta). Se corren a mano contra Neon (SQL Editor del dashboard, o `psql`).

## Límite de funciones serverless (Vercel Hobby)

El plan Hobby de Vercel permite **máximo 12 Serverless Functions** por
deployment. Cada archivo en `/api` (fuera de `_lib/`) cuenta como una.
Hoy hay 10 — margen de 2 antes de necesitar consolidar de nuevo.

Antes de agregar un archivo nuevo en `/api`, correr:

```bash
find api -name "*.ts" -not -path "*/_lib/*" | wc -l
```

Si ya se está cerca del límite, preferir ramificar por `req.method` o por
query param dentro de un archivo existente del mismo recurso, en vez de
crear uno nuevo (ver `api/citas/index.ts` o `api/documentos/index.ts`
como ejemplos de este patrón).

## Variables de entorno

Ver `.env.example`. `DATABASE_URL` (Neon), `CLERK_SECRET_KEY` +
`CLERK_PUBLISHABLE_KEY` (backend), `VITE_CLERK_PUBLISHABLE_KEY` (frontend,
misma key pública que `CLERK_PUBLISHABLE_KEY` con el prefijo que Vite
necesita para exponerla al navegador), y `CLOUDINARY_CLOUD_NAME` +
`CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` (documentos adjuntos de
pacientes — el archivo sube directo del navegador a Cloudinary con una
firma que genera el backend, nunca pasa por nuestras funciones serverless
ni expone la API secret).

## Pendiente conocido: jerarquía de headings

Varios componentes movidos de la Home a página propia (Faq, y potencialmente
otros) todavía usan `<h2>` como si vivieran dentro de una página más larga.
Como ahora son el contenido principal de su propia ruta, deberían tener un
`<h1>` visible en la página — revisar cada página pública antes de publicar
(accesibilidad y SEO, secciones 43 y 47 del Prompt 2.0).
