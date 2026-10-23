# Guía de despliegue y verificación

Orden exacto para publicar el sitio y comprobar que todo funciona. Pensada para hacerse de corrido en 1 a 2 horas.

## 1. Base de datos (Neon)

En el SQL Editor de Neon, ejecuta en este orden las migraciones que aún no estén aplicadas (están en `db/migrations/`). Si empezaste de cero, todas, de `001` a `012`.

**Importante:** la `012_consentimiento.sql` va ANTES de publicar el código nuevo. El formulario de reserva ya guarda el consentimiento y fallaría sin esas columnas.

Después, genera los cupos del próximo sábado (ver README, "Generar los slots").

## 2. Variables de entorno (Vercel, Settings, Environment Variables)

| Variable | Qué es | Dónde se consigue |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión de Neon | Neon, Connection details |
| `CLERK_SECRET_KEY` | Clave secreta de Clerk | Clerk, API Keys |
| `CLERK_PUBLISHABLE_KEY` | Clave pública de Clerk (servidor) | Clerk, API Keys |
| `VITE_CLERK_PUBLISHABLE_KEY` | La misma clave pública (navegador) | Clerk, API Keys |
| `ADMIN_USER_IDS` | IDs de usuario de Clerk de Rebeca y tuyo, separados por coma | Clerk, Users, abrir cada usuario, copiar `user_...` |
| `CRON_SECRET` | Cadena larga y aleatoria (32+ caracteres) | La inventas tú |
| `VITE_SITE_URL` | Dirección pública, sin `/` al final | Por ejemplo `https://psivelasquez.vercel.app` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cuenta de Cloudinary | Cloudinary, Dashboard |
| `AUTHORIZED_PARTIES` | (Opcional) Dominios desde los que se acepta iniciar sesión, separados por coma | Tu dominio |

`ADMIN_USER_IDS` es obligatoria: si falta, nadie puede entrar al panel (es a propósito, falla cerrado).

Las variables `VITE_...` se leen al construir: si las cambias, hay que volver a desplegar.

## 3. Clerk

1. Desactivar el registro público: User & Authentication, Restrictions, apagar "Sign-up". Solo deben entrar Rebeca y tú.
2. Verificar que ambos usuarios existen y sus IDs están en `ADMIN_USER_IDS`.
3. Más adelante, con dominio propio: crear la instancia de producción, cambiar las claves en Vercel y seguir el README (sección de CSP) para agregar el dominio de Clerk.

## 4. Publicar

`git push` y esperar el despliegue en Vercel. El build corre `tsc`, genera las 17 páginas prerenderizadas y el sitemap.

## 5. Verificación (10 a 15 minutos)

**Sitio público**
- [ ] El inicio carga y el título se ve de inmediato.
- [ ] `/reservar` muestra los cupos del sábado.
- [ ] Reservar un cupo con datos de prueba: pide aceptar la política de privacidad y confirma.
- [ ] Ese cupo aparece como "Por confirmar" en el panel.
- [ ] `/sitemap.xml` y `/robots.txt` responden.

**Panel (entrar a `/admin`)**
- [ ] Entra con tu cuenta y con la de Rebeca. Con una cuenta que no esté en `ADMIN_USER_IDS` NO debe dejar entrar.
- [ ] Hoy, Agenda, Pacientes, Seguimiento, Tareas, Finanzas, Credenciales y Contenido abren sin errores.
- [ ] Confirmar la reserva de prueba desde Agenda.
- [ ] Abrir la ficha del paciente de prueba, escribir una nota de sesión y ver "Guardado".
- [ ] Registrar una escala (GAD-7) y ver el gráfico.
- [ ] Subir un documento de prueba y abrirlo (el enlace dura 5 minutos).
- [ ] Descargar el respaldo CSV desde Pacientes.
- [ ] Borrar el paciente de prueba.

**Seguridad y trabajo programado**
- [ ] Abrir `/api/cron/generar-slots` desde el navegador: debe responder 401.
- [ ] En Vercel, Cron Jobs, ejecutar el trabajo una vez y ver que responde bien.
- [ ] Con las herramientas del navegador abiertas, entrar a `/sign-in` y revisar que no haya avisos de "Content Security Policy" (ver README).

Si algo falla, anota la pantalla y el mensaje exacto y mándamelo.

## 6. Después de que Rebeca apruebe los textos

Quitar `noindex: true` de `/como-trabajo`, `/aviso-etico` y `/privacidad` en `src/modules/shared/seo/sitio.ts` y volver a publicar.
