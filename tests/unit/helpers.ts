import type { VercelRequest, VercelResponse } from '@vercel/node'

export interface RespuestaFalsa {
  status: number
  cuerpo: unknown
  cabeceras: Record<string, string>
}

/** Construye un request/response mínimos de Vercel para probar los handlers sin servidor. */
export function llamar(
  handler: (req: VercelRequest, res: VercelResponse) => unknown,
  opciones: { method?: string; query?: Record<string, string>; body?: unknown; headers?: Record<string, string> } = {},
): Promise<RespuestaFalsa> {
  const respuesta: RespuestaFalsa = { status: 200, cuerpo: undefined, cabeceras: {} }
  const req = {
    method: opciones.method ?? 'GET',
    query: opciones.query ?? {},
    body: opciones.body,
    headers: { host: 'localhost', ...(opciones.headers ?? {}) },
    url: '/api/prueba',
  } as unknown as VercelRequest

  return new Promise((resolver, rechazar) => {
    const res = {
      status(codigo: number) {
        respuesta.status = codigo
        return res
      },
      json(valor: unknown) {
        respuesta.cuerpo = valor
        resolver(respuesta)
        return res
      },
      send(valor: unknown) {
        respuesta.cuerpo = valor
        resolver(respuesta)
        return res
      },
      end() {
        resolver(respuesta)
        return res
      },
      setHeader(nombre: string, valor: string) {
        respuesta.cabeceras[nombre.toLowerCase()] = String(valor)
        return res
      },
    } as unknown as VercelResponse
    Promise.resolve(handler(req, res)).catch(rechazar)
  })
}
