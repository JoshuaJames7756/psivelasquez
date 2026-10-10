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
deployment. **Cada archivo dentro de `/api`, SIN excepción, cuenta como
una función** — esto incluye helpers compartidos (`db.ts`, `auth.ts`,
etc.), aunque no exporten un handler HTTP. Confirmado con el equipo de
Vercel en su foro oficial: la regla es "cualquier archivo top-level
dentro de `/api`", no "cualquier archivo que exporte un handler".

Por eso los helpers compartidos viven en `/server-lib` (carpeta
HERMANA de `/api`, no una subcarpeta suya) y se importan con rutas
relativas normales (`../../server-lib/db.js` desde `api/citas/index.ts`,
por ejemplo) — Vercel usa Node File Trace para seguir esos imports y
empaquetarlos dentro de cada función igual, sin que cuenten para el
límite de 12.

**Hoy hay 12 archivos en `/api` — EN EL LÍMITE, sin margen.** Cualquier
archivo nuevo en `/api` rompe el deploy de inmediato. Antes de agregar
algo, fusionarlo dentro de un endpoint existente del mismo recurso
(ramificando por `req.method` o query param), o consolidar primero.

Antes de agregar un archivo nuevo ahí, correr:

```bash
find api -name "*.ts" | wc -l
```

Si ya se está cerca del límite, preferir ramificar por `req.method` o por
query param dentro de un archivo existente del mismo recurso, en vez de
crear uno nuevo (ver `api/citas/index.ts` o `api/documentos/index.ts`
como ejemplos de este patrón). Nunca crear un helper nuevo dentro de
`/api` — siempre en `/server-lib`.

## Variables de entorno

Ver `.env.example`. `DATABASE_URL` (Neon), `CLERK_SECRET_KEY` +
`CLERK_PUBLISHABLE_KEY` (backend), `VITE_CLERK_PUBLISHABLE_KEY` (frontend,
misma key pública que `CLERK_PUBLISHABLE_KEY` con el prefijo que Vite
necesita para exponerla al navegador), y `CLOUDINARY_CLOUD_NAME` +
`CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` (documentos adjuntos de
pacientes — el archivo sube directo del navegador a Cloudinary con una
firma que genera el backend, nunca pasa por nuestras funciones serverless
ni expone la API secret).

## Pendiente conocido: preview de PDF en certificaciones no funciona

Las imágenes suben y se ven bien (grid + modal). Los PDFs suben
correctamente a Cloudinary pero el preview (urlPreviewImagen con
f_jpg) no renderiza — confirmado con Joshua, probado y sigue sin
funcionar. Posibles causas a investigar en la próxima pasada:
- El plan gratuito de Cloudinary puede seguir bloqueando la entrega
  de PDFs aunque se pida como f_jpg (no confirmado si "Allow delivery
  of PDF and ZIP files" ya se habilitó en el dashboard)
- La URL guardada en DB de las certificaciones de PDF puede tener un
  formato distinto al esperado (revisar qué URL exacta devolvió
  Cloudinary en la subida)
- Mientras tanto: certificaciones en PDF se pueden cargar sin
  archivo adjunto, o convertir a imagen (JPG/PNG) manualmente antes
  de subir, como workaround.


## Contenido editable del sitio (`/api/sitio`)

Certificaciones y publicaciones de redes comparten UNA función:
`api/sitio.ts?recurso=certificaciones|redes`. La lógica vive en
`server-lib/certificaciones.ts` y `server-lib/redes.ts`. Para otro
recurso editable se agrega un manejador en `server-lib` y una línea en
`api/sitio.ts`, sin tocar el límite de 12 funciones (hoy: 12).

Migración nueva: `009_publicaciones_redes.sql` (obligatoria para la
sección "Contenido" y la página `/admin/contenido`). Si la tabla no
existe, la sección pública simplemente no se muestra.

## Panel clínico: notas, exportación y precio

- Migración `010_notas_rapidas.sql`: notas rápidas del panel (Hoy). Viven
  en `api/tareas.ts?recurso=notas` (lógica en `server-lib/notas.ts`).
- Notas de sesión: `POST /api/pacientes/:id {accion:'nota'}` crea, `DELETE`
  elimina, `PUT /api/historial/:id` autoguarda. Alta manual de pacientes:
  `POST /api/pacientes`. Edición de datos: `PATCH /api/pacientes/:id`.
- Precio de sesión: `PUT /api/resumen-mes {precioSesion}`.
- Exportar a PDF: se genera en el navegador (diálogo de impresión,
  "Guardar como PDF"); los datos clínicos no salen a ningún servicio.
  Requiere permitir ventanas emergentes en el sitio.
- Cada alta, edición, creación o borrado de notas queda en `audit_log`.

## Documentos de pacientes privados (migración 011)

Los adjuntos nuevos se suben a Cloudinary con `type: authenticated`: la URL
directa no funciona. Se abren desde la ficha con `GET /api/documentos?id=`,
que verifica la sesión, registra el acceso en auditoría y devuelve un enlace
firmado que vence a los 5 minutos. Eliminar un documento privado también lo
borra de Cloudinary. Los documentos subidos antes de esta migración quedan
marcados "Público" hasta que se eliminen y se vuelvan a adjuntar.

## SEO

- `src/modules/shared/seo/sitio.ts`: título, descripción y datos estructurados de cada página (fuente única).
- `npm run build` hace cuatro pasos: compila el cliente, compila el servidor
  (`src/entry-server.tsx`) y `scripts/prerender.mjs` escribe un HTML por ruta
  (con metadatos y contenido ya renderizado), más `sitemap.xml` y `robots.txt`.
  Vercel sirve esos archivos estáticos antes de la regla que reescribe a `index.html`.
- **Dominio propio:** definir `VITE_SITE_URL` en Vercel (ej. `https://www.midominio.com`)
  y volver a desplegar: cambia canonical, Open Graph, sitemap y robots.
- Páginas con `noindex: true` en `sitio.ts` (hoy Cómo trabajo y Aviso ético, por no
  tener contenido final) no entran al sitemap. Quitar el flag al publicar el texto.
- `/admin` y `/sign-in`: bloqueados en robots.txt, con `noindex` en la página y
  con cabecera `X-Robots-Tag` (vercel.json).
- Imagen para compartir: `public/og-imagen.jpg` (1200x630).
- Pendiente fuera del código: Google Business Profile y Search Console.
