# Guía de despliegue V1 (sitio estático en Cloudflare)

V1 es solo el sitio público: sin panel, sin login, sin base de datos y sin variables de entorno secretas.
La reserva arma un mensaje y abre WhatsApp (número en `src/modules/public/data/contacto.ts`).
No hay que ejecutar ninguna migración SQL.

## 1. Probar en local
    npm install
    npm test
    npm run build        # genera dist/ con 17 páginas prerenderizadas, sitemap y robots

## 2. Dominio y URL
Con el dominio comprado, compila con su URL para que sitemap y canonical salgan correctos:
    VITE_SITE_URL=https://TUDOMINIO.com npm run build

## 3. Publicar en Cloudflare (plan gratis, sin tarjeta)
1. Crea cuenta en dash.cloudflare.com.
2. Opción A (rápida): `npx wrangler login` y luego `npx wrangler deploy` (usa `wrangler.jsonc`, sirve la carpeta `dist`).
3. Opción B: conecta el repo en Workers & Pages. Build: `npm run build`. Variable `VITE_SITE_URL` con tu dominio.
4. En el proyecto, Settings > Domains > Add custom domain.
Los archivos estáticos no consumen la cuota de peticiones de Workers. Las cabeceras de seguridad están en `public/_headers`.

## 4. Verificar después de publicar
- Abrir `/`, `/reservar/`, `/privacidad/` y una ruta inexistente (debe mostrar 404).
- Enviar el formulario de reserva: debe abrir WhatsApp con el mensaje.
- `/sitemap.xml` y `/robots.txt` con tu dominio.

## V2 y V3
- V2: completar biografía, trayectoria y fotos en los archivos de `src/modules/public/data` y componentes indicados en comentarios.
- V3 (panel, agenda, reservas): el código sigue en `api/`, `server-lib/`, `db/migrations` (001 a 012) y `src/modules/admin`. Se reactiva compilando con `VITE_PANEL=1` y usando `vercel.json` (Vercel + Neon + Clerk). Hay un respaldo completo: `rebeca-velasquez-v3-panel.zip`.
