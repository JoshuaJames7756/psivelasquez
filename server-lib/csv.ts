/**
 * Utilidades para generar CSV seguro.
 *
 * Separador ";" porque Excel en español (Bolivia incluida) lo espera
 * así; Google Sheets y LibreOffice lo detectan sin problema. El BOM
 * UTF-8 al inicio hace que Excel muestre bien tildes y eñes.
 *
 * Protección contra "inyección de fórmulas": si una celda empieza con
 * = + - @ (o tab / retorno), Excel la ejecutaría como fórmula. Como
 * los textos vienen de formularios públicos (motivo, nombre), se
 * antepone un apóstrofo para que siempre se lea como texto.
 */
const BOM = '﻿'
const SEP = ';'

function celda(valor: unknown): string {
  if (valor === null || valor === undefined) return ''
  let texto =
    valor instanceof Date ? valor.toISOString() : typeof valor === 'string' ? valor : String(valor)
  if (/^[=+\-@\t\r]/.test(texto)) texto = `'${texto}`
  if (/[";\n\r]/.test(texto)) texto = `"${texto.replace(/"/g, '""')}"`
  return texto
}

export function generarCsv(columnas: string[], filas: unknown[][]): string {
  const lineas = [columnas, ...filas].map((fila) => fila.map(celda).join(SEP))
  return BOM + lineas.join('\r\n') + '\r\n'
}
