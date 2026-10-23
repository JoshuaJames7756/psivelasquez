import { beforeEach, describe, expect, it, vi } from 'vitest'
import { llamar } from './helpers'

const sqlFalso = vi.hoisted(() => vi.fn(async (..._a: unknown[]) => [] as unknown[]))
vi.mock('../../server-lib/db.js', () => ({ sql: sqlFalso, vencerSlotsExpirados: vi.fn(async () => undefined) }))
vi.mock('../../server-lib/auth.js', () => ({ verificarSesion: vi.fn(async () => null) }))

import citas from '../../api/citas/index'

const UUID = '123e4567-e89b-12d3-a456-426614174000'
const cuerpo = {
  slotId: UUID, nombre: 'Ana Pérez', edad: 30, telefono: '70012345', motivoInicial: 'Ansiedad',
  primeraVez: true, modalidad: 'presencial', consentimiento: true,
}

beforeEach(() => sqlFalso.mockReset())

describe('POST /api/citas (reserva pública)', () => {
  it('rechaza si no se aceptó la política de privacidad', async () => {
    const r = await llamar(citas, { method: 'POST', body: { ...cuerpo, consentimiento: false } })
    expect(r.status).toBe(400)
    expect(sqlFalso).not.toHaveBeenCalled()
  })

  it('la trampa para bots responde ok sin tocar la base de datos', async () => {
    const r = await llamar(citas, { method: 'POST', body: { ...cuerpo, sitioWeb: 'http://spam.example' } })
    expect(r.status).toBe(201)
    expect(sqlFalso).not.toHaveBeenCalled()
  })

  it('un mismo teléfono no puede tener dos solicitudes pendientes', async () => {
    sqlFalso.mockResolvedValueOnce([{ id: UUID, estado: 'disponible' }]) // el cupo
    sqlFalso.mockResolvedValueOnce([{ '?column?': 1 }]) // ya hay una pendiente con ese teléfono
    const r = await llamar(citas, { method: 'POST', body: cuerpo })
    expect(r.status).toBe(429)
  })

  it('con 5 solicitudes pendientes ya no acepta más y pide usar WhatsApp', async () => {
    sqlFalso.mockResolvedValueOnce([{ id: UUID, estado: 'disponible' }])
    sqlFalso.mockResolvedValueOnce([]) // teléfono sin pendientes
    sqlFalso.mockResolvedValueOnce([{ total: 5 }])
    const r = await llamar(citas, { method: 'POST', body: cuerpo })
    expect(r.status).toBe(429)
    expect(JSON.stringify(r.cuerpo)).toMatch(/WhatsApp/)
    expect(sqlFalso).toHaveBeenCalledTimes(3) // nunca llegó a insertar
  })

  it('con menos de 5 pendientes la reserva se crea', async () => {
    sqlFalso.mockResolvedValueOnce([{ id: UUID, estado: 'disponible' }])
    sqlFalso.mockResolvedValueOnce([])
    sqlFalso.mockResolvedValueOnce([{ total: 4 }])
    sqlFalso.mockResolvedValueOnce([{ id: UUID, estado: 'solicitada', expira_en: '2026-10-25T00:00:00Z' }])
    const r = await llamar(citas, { method: 'POST', body: cuerpo })
    expect(r.status).toBe(201)
  })
})
