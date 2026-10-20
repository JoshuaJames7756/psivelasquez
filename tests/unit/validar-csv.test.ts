import { describe, expect, it } from 'vitest'
import { generarCsv } from '../../server-lib/csv'
import { esFecha, esUuid, textoOpcionalValido, urlCloudinary } from '../../server-lib/validar'

describe('validadores', () => {
  it('esUuid acepta UUID y rechaza todo lo demás', () => {
    expect(esUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
    expect(esUuid('123e4567')).toBe(false)
    expect(esUuid("1' or '1'='1")).toBe(false)
    expect(esUuid(undefined)).toBe(false)
    expect(esUuid(42)).toBe(false)
  })

  it('esFecha exige formato AAAA-MM-DD y fecha real', () => {
    expect(esFecha('2026-10-17')).toBe(true)
    expect(esFecha('17/10/2026')).toBe(false)
    expect(esFecha('2026-13-45')).toBe(false)
    expect(esFecha(null)).toBe(false)
  })

  it('textoOpcionalValido respeta el máximo', () => {
    expect(textoOpcionalValido(undefined, 5)).toBe(true)
    expect(textoOpcionalValido('abcde', 5)).toBe(true)
    expect(textoOpcionalValido('abcdef', 5)).toBe(false)
    expect(textoOpcionalValido(123, 5)).toBe(false)
  })

  it('urlCloudinary solo acepta https://res.cloudinary.com', () => {
    expect(urlCloudinary('https://res.cloudinary.com/demo/image/upload/a.jpg')).toBe(true)
    expect(urlCloudinary('http://res.cloudinary.com/demo/a.jpg')).toBe(false)
    expect(urlCloudinary('https://res.cloudinary.com.evil.com/a.jpg')).toBe(false)
    expect(urlCloudinary('javascript:alert(1)')).toBe(false)
    expect(urlCloudinary('no es url')).toBe(false)
  })
})

describe('generarCsv', () => {
  it('empieza con BOM, usa ; y CRLF', () => {
    const csv = generarCsv(['A', 'B'], [['uno', 'dos']])
    expect(csv.startsWith('﻿')).toBe(true)
    expect(csv).toBe('﻿A;B\r\nuno;dos\r\n')
  })

  it('escapa comillas, punto y coma y saltos de línea', () => {
    const csv = generarCsv(['X'], [['dijo "hola"; adiós\nfin']])
    expect(csv).toContain('"dijo ""hola""; adiós\nfin"')
  })

  it('neutraliza fórmulas de Excel (= + - @)', () => {
    const csv = generarCsv(['X'], [['=HYPERLINK("http://x")'], ['+591'], ['-5'], ['@SUM(A1)']])
    const lineas = csv.split('\r\n')
    expect(lineas[1].replace(/^"/, '').startsWith("'=")).toBe(true)
    expect(lineas[2]).toBe("'+591")
    expect(lineas[3]).toBe("'-5")
    expect(lineas[4]).toBe("'@SUM(A1)")
  })

  it('celdas vacías y números', () => {
    expect(generarCsv(['A', 'B', 'C'], [[null, undefined, 0]])).toBe('﻿A;B;C\r\n;;0\r\n')
  })
})
