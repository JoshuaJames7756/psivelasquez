import { describe, expect, it } from 'vitest'
import { construirMensajeReserva, linkWhatsApp } from '../../src/modules/shared/utils/whatsapp'

const base = { nombre: '  Ana Pérez ', modalidad: 'online', horario: 'manana', primeraVez: true } as const

describe('mensaje de reserva por WhatsApp', () => {
  it('incluye solo los datos dados y recorta espacios', () => {
    const m = construirMensajeReserva(base)
    expect(m).toContain('Nombre: Ana Pérez')
    expect(m).toContain('Modalidad: online')
    expect(m).toContain('Horario preferido: por la mañana')
    expect(m).toContain('Primera vez en terapia: sí')
    expect(m).not.toContain('Edad')
    expect(m).not.toContain('Motivo')
  })

  it('agrega edad y motivo cuando existen y limita el motivo a 300 caracteres', () => {
    const m = construirMensajeReserva({ ...base, edad: '29', motivo: 'x'.repeat(500), primeraVez: false })
    expect(m).toContain('Edad: 29')
    expect(m).toContain('Primera vez en terapia: no')
    expect(m.split('Motivo breve: ')[1]).toHaveLength(300)
  })

  it('el enlace queda bien codificado para wa.me', () => {
    const url = linkWhatsApp('59160389762', construirMensajeReserva(base))
    expect(url.startsWith('https://wa.me/59160389762?text=')).toBe(true)
    expect(url).not.toMatch(/\s/)
    expect(decodeURIComponent(url.split('text=')[1])).toContain('Hola Rebeca')
  })
})
