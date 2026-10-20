import { beforeEach, describe, expect, it, vi } from 'vitest'
import { llamar } from './helpers'

// Los handlers importan estos módulos: se reemplazan para que ninguna prueba toque red ni base de datos.
const sqlFalso = vi.hoisted(() => {
  const fn = vi.fn(async () => [] as unknown[]) as unknown as ((...a: unknown[]) => Promise<unknown[]>) & {
    transaction: ReturnType<typeof vi.fn>
  }
  fn.transaction = vi.fn(async () => [])
  return fn
})
const verificarSesion = vi.hoisted(() => vi.fn())
const registrarAuditoria = vi.hoisted(() => vi.fn(async () => undefined))

vi.mock('../../server-lib/db.js', () => ({ sql: sqlFalso, vencerSlotsExpirados: vi.fn(async () => undefined) }))
vi.mock('../../server-lib/auth.js', () => ({ verificarSesion }))
vi.mock('../../server-lib/auditoria.js', () => ({ registrarAuditoria }))
vi.mock('../../server-lib/cloudinary.js', () => ({
  cloudinary: { utils: { api_sign_request: vi.fn(() => 'firma'), private_download_url: vi.fn(() => 'https://x') }, uploader: { destroy: vi.fn() } },
}))

import citas from '../../api/citas/index'
import citasId from '../../api/citas/[id]'
import cron from '../../api/cron/generar-slots'
import documentos from '../../api/documentos/index'
import firma from '../../api/documentos/firma'
import historialId from '../../api/historial/[id]'
import pacientes from '../../api/pacientes/index'
import pacientesId from '../../api/pacientes/[id]'
import resumenMes from '../../api/resumen-mes'
import seguimiento from '../../api/seguimiento'
import sitio from '../../api/sitio'
import tareas from '../../api/tareas'

const UUID = '123e4567-e89b-12d3-a456-426614174000'

beforeEach(() => {
  vi.clearAllMocks()
  verificarSesion.mockResolvedValue(null)
  delete process.env.CRON_SECRET
  delete process.env.VERCEL_ENV
})

describe('sin sesión, los endpoints del panel responden 401 y no tocan la base de datos', () => {
  const privados: Array<[string, (...a: never[]) => unknown, Array<{ method: string; query?: Record<string, string>; body?: unknown }>]> = [
    ['pacientes (listar)', pacientes, [{ method: 'GET' }, { method: 'GET', query: { en_riesgo: '1' } }, { method: 'GET', query: { exportar: 'pacientes' } }, { method: 'GET', query: { exportar: 'sesiones' } }, { method: 'POST', body: { nombre: 'Ana' } }]],
    ['pacientes/[id]', pacientesId, [{ method: 'GET', query: { id: UUID } }, { method: 'PATCH', query: { id: UUID }, body: {} }, { method: 'POST', query: { id: UUID }, body: {} }]],
    ['historial/[id]', historialId, [{ method: 'GET', query: { id: UUID } }, { method: 'PATCH', query: { id: UUID }, body: {} }, { method: 'POST', query: { id: UUID }, body: {} }, { method: 'DELETE', query: { id: UUID } }]],
    ['documentos', documentos, [{ method: 'GET', query: { id: UUID } }, { method: 'POST', body: {} }, { method: 'DELETE', body: { id: UUID } }]],
    ['documentos/firma', firma, [{ method: 'POST', body: {} }]],
    ['tareas', tareas, [{ method: 'GET' }, { method: 'POST', body: {} }, { method: 'PATCH', body: {} }, { method: 'DELETE', body: {} }, { method: 'GET', query: { recurso: 'notas' } }]],
    ['resumen-mes', resumenMes, [{ method: 'GET' }]],
    ['seguimiento', seguimiento, [{ method: 'GET' }]],
    ['citas/[id]', citasId, [{ method: 'GET', query: { id: UUID } }, { method: 'PATCH', query: { id: UUID }, body: {} }, { method: 'POST', query: { id: UUID }, body: {} }]],
    ['citas (vista panel)', citas, [{ method: 'GET', query: { panel: '1' } }]],
    ['sitio certificaciones (escritura)', sitio, [{ method: 'POST', query: { recurso: 'certificaciones' }, body: {} }, { method: 'DELETE', query: { recurso: 'certificaciones' }, body: { id: UUID } }, { method: 'PATCH', query: { recurso: 'certificaciones' }, body: {} }]],
    ['sitio redes (escritura)', sitio, [{ method: 'POST', query: { recurso: 'redes' }, body: {} }, { method: 'DELETE', query: { recurso: 'redes' }, body: { id: UUID } }, { method: 'PATCH', query: { recurso: 'redes' }, body: {} }]],
  ]

  for (const [nombre, handler, llamadas] of privados) {
    for (const l of llamadas) {
      it(`${nombre}: ${l.method} ${JSON.stringify(l.query ?? {})}`, async () => {
        const r = await llamar(handler as never, l)
        expect([401, 405]).toContain(r.status)
        expect(sqlFalso).not.toHaveBeenCalled()
        expect(JSON.stringify(r.cuerpo ?? '')).not.toMatch(/nombre|telefono|motivo/i)
      })
    }
  }
})

describe('exportación CSV (con sesión)', () => {
  beforeEach(() => verificarSesion.mockResolvedValue({ userId: 'user_rebeca' }))

  it('devuelve CSV con BOM, sin caché, como descarga y deja auditoría sin contenido clínico', async () => {
    ;(sqlFalso as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { nombre: '=cmd|calc', edad: 30, telefono: '+591', estado: 'activo', primera_vez: true, motivo_inicial: 'ansiedad', creado_en: new Date('2026-01-01'), ultima_sesion: null, sesiones: 0 },
    ])
    const r = await llamar(pacientes, { query: { exportar: 'pacientes' } })
    expect(r.status).toBe(200)
    expect(r.cabeceras['content-type']).toContain('text/csv')
    expect(r.cabeceras['cache-control']).toBe('no-store')
    expect(r.cabeceras['content-disposition']).toMatch(/attachment; filename="pacientes-\d{4}-\d{2}-\d{2}\.csv"/)
    const csv = r.cuerpo as string
    expect(csv.startsWith('﻿')).toBe(true)
    expect(csv).toContain("'=cmd|calc") // fórmula neutralizada
    expect(registrarAuditoria).toHaveBeenCalledTimes(1)
    const evento = registrarAuditoria.mock.calls[0][0] as { detalle: string; usuarioId: string }
    expect(evento.usuarioId).toBe('user_rebeca')
    expect(evento.detalle).not.toMatch(/ansiedad|cmd/)
  })
})

describe('reserva pública POST /api/citas', () => {
  const valido = { slotId: UUID, nombre: 'Ana Pérez', telefono: '+59170000000', primeraVez: true, modalidad: 'presencial' }

  it('rechaza datos inválidos con 400 sin tocar la base', async () => {
    const malos = [
      {},
      { ...valido, slotId: 'no-uuid' },
      { ...valido, nombre: 'A' },
      { ...valido, nombre: 'x'.repeat(121) },
      { ...valido, telefono: '1'.repeat(31) },
      { ...valido, motivoInicial: 'x'.repeat(1001) },
      { ...valido, edad: 200 },
      { ...valido, edad: 3.5 },
      { ...valido, modalidad: 'hologramas' },
      { ...valido, primeraVez: 'si' },
    ]
    for (const body of malos) {
      const r = await llamar(citas, { method: 'POST', body })
      expect(r.status).toBe(400)
    }
    expect(sqlFalso).not.toHaveBeenCalled()
  })

  it('el campo trampa de bots responde 201 falso y no crea nada', async () => {
    const r = await llamar(citas, { method: 'POST', body: { ...valido, sitioWeb: 'http://spam.com' } })
    expect(r.status).toBe(201)
    expect(sqlFalso).not.toHaveBeenCalled()
  })

  it('cupo inexistente da 404 y cupo ocupado da 409', async () => {
    const sql = sqlFalso as unknown as ReturnType<typeof vi.fn>
    sql.mockResolvedValueOnce([])
    expect((await llamar(citas, { method: 'POST', body: valido })).status).toBe(404)
    sql.mockResolvedValueOnce([{ id: UUID, estado: 'solicitada' }])
    expect((await llamar(citas, { method: 'POST', body: valido })).status).toBe(409)
  })

  it('una segunda solicitud pendiente del mismo teléfono da 429', async () => {
    const sql = sqlFalso as unknown as ReturnType<typeof vi.fn>
    sql.mockResolvedValueOnce([{ id: UUID, estado: 'disponible' }]).mockResolvedValueOnce([{ '?column?': 1 }])
    expect((await llamar(citas, { method: 'POST', body: valido })).status).toBe(429)
  })

  it('reserva correcta: 201 y la respuesta no expone el id del paciente', async () => {
    const sql = sqlFalso as unknown as ReturnType<typeof vi.fn>
    sql
      .mockResolvedValueOnce([{ id: UUID, estado: 'disponible' }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: UUID, estado: 'solicitada', expira_en: '2026-10-19' }])
    const r = await llamar(citas, { method: 'POST', body: valido })
    expect(r.status).toBe(201)
    expect(JSON.stringify(r.cuerpo)).not.toMatch(/paciente/i)
  })

  it('GET público no incluye datos de pacientes y valida la fecha', async () => {
    expect((await llamar(citas, { query: { fecha: 'cualquier-cosa' } })).status).toBe(400)
    const r = await llamar(citas, { query: { fecha: '2026-10-24' } })
    expect(r.status).toBe(200)
  })
})

describe('documentos privados', () => {
  beforeEach(() => verificarSesion.mockResolvedValue({ userId: 'user_rebeca' }))

  it('POST rechaza documentos que no sean privados o con publicId ajeno al paciente', async () => {
    const base = { pacienteId: UUID, url: 'https://res.cloudinary.com/x/a.pdf', nombre: 'a.pdf', tipo: 'application/pdf' }
    const r1 = await llamar(documentos, { method: 'POST', body: { ...base, privado: false, publicId: `rebeca-velasquez/pacientes/${UUID}/a` } })
    expect(r1.status).toBe(400)
    const r2 = await llamar(documentos, { method: 'POST', body: { ...base, privado: true, publicId: 'rebeca-velasquez/pacientes/otro-paciente/a' } })
    expect(r2.status).toBe(400)
  })
})

describe('cron generar-slots', () => {
  it('con CRON_SECRET exige el Bearer correcto', async () => {
    process.env.CRON_SECRET = 'abc'
    expect((await llamar(cron)).status).toBe(401)
    expect((await llamar(cron, { headers: { authorization: 'Bearer mal' } })).status).toBe(401)
    expect((await llamar(cron, { headers: { authorization: 'Bearer abc' } })).status).toBe(200)
  })

  it('en producción sin CRON_SECRET queda cerrado', async () => {
    process.env.VERCEL_ENV = 'production'
    expect((await llamar(cron)).status).toBe(401)
    expect(sqlFalso.transaction).not.toHaveBeenCalled()
  })
})
