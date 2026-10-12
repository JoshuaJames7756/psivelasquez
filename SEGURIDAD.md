# Seguridad: estado y checklist

Revisión hecha sobre toda la API (`/api` y `/server-lib`).

## Antes de cada lanzamiento (obligatorio)
1. **`ADMIN_USER_IDS`** definida en Vercel (IDs de Clerk de Rebeca y soporte). Sin ella el panel rechaza a todos.
2. En Clerk: desactivar el registro público (Configure → Restrictions → Sign-ups) o dejar solo invitaciones.
3. Clerk en modo producción (claves `pk_live_` / `sk_live_`) con el dominio propio.
4. `AUTHORIZED_PARTIES` con los dominios reales (recomendado).
5. `CRON_SECRET` definida (el cron solo debe ser invocable por Vercel).
6. Migraciones 001 a 011 aplicadas.

## Qué se verifica en el servidor (Zero-Trust)
- Toda ruta del panel exige sesión válida de Clerk **y** que el usuario esté en `ADMIN_USER_IDS`.
- Los únicos endpoints públicos: `GET /api/citas` (solo cupos, sin datos de pacientes), `POST /api/citas` (reserva),
  `GET /api/sitio` (certificaciones y publicaciones visibles).
- Consultas SQL siempre parametrizadas (nunca se concatena texto).
- IDs validados como UUID, fechas como `YYYY-MM-DD`, textos con largo máximo, enums con lista cerrada.
- Reserva pública: largo máximo de campos, campo trampa anti bots, una solicitud pendiente por teléfono, y el paciente se crea
  solo si el cupo sigue libre (sin registros huérfanos).
- Documentos de pacientes: privados en Cloudinary, enlace firmado de 5 minutos, apertura registrada en auditoría.
- URLs guardadas: miniaturas y certificados solo de `res.cloudinary.com`; redes solo https de instagram.com o tiktok.com.
- Auditoría de accesos y cambios en fichas, notas, escalas, documentos y precio.
- Cabeceras: `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, `X-Robots-Tag` en panel y login.

## Riesgos que quedan (conocidos)
- **Spam de reservas con teléfonos distintos**: no hay límite por IP. Mitigación gratuita: regla de rate limit en Vercel Firewall
  sobre `POST /api/citas`; o un captcha (Cloudflare Turnstile es gratis) si aparece abuso real.
- **Sin CSP** (Content-Security-Policy): Clerk, Cloudinary y Google Maps hacen que una política estricta requiera pruebas; pendiente.
- **Documentos subidos antes de la migración 011** siguen con enlace público: eliminar y volver a adjuntar.
- **Autoguardado de notas** no se audita (sería ruido); sí se audita crear y eliminar.
- **Cron abierto si no hay `CRON_SECRET`**: es idempotente (no duplica cupos), pero conviene definirlo.
- Los logs de Vercel pueden incluir mensajes de error de Postgres; no compartir capturas de logs.
