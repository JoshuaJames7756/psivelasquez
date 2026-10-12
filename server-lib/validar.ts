/** Validadores pequeños y reutilizables para entradas de la API (Zero-Trust: nunca confiar en el navegador). */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const FECHA = /^\d{4}-\d{2}-\d{2}$/

export const esUuid = (v: unknown): v is string => typeof v === 'string' && UUID.test(v)

export const esFecha = (v: unknown): v is string =>
  typeof v === 'string' && FECHA.test(v) && !Number.isNaN(Date.parse(v))

/** Texto opcional: undefined/null/'' pasan; si viene, debe ser string de hasta `max` caracteres. */
export const textoOpcionalValido = (v: unknown, max: number): boolean =>
  v === undefined || v === null || (typeof v === 'string' && v.length <= max)

/** URL https de Cloudinary (las imágenes del sitio y los adjuntos solo salen de ahí). */
export function urlCloudinary(v: unknown): v is string {
  if (typeof v !== 'string') return false
  try {
    const u = new URL(v)
    return u.protocol === 'https:' && u.hostname === 'res.cloudinary.com'
  } catch {
    return false
  }
}
