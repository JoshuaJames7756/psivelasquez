import type { EscalaSeguimiento, TipoEscala } from '../../shared/types/db'

const COLOR_POR_TIPO: Record<TipoEscala, string> = {
  'GAD-7': 'var(--color-sage-500)',
  'PHQ-9': 'var(--color-terracotta-400)',
}

// Rangos clínicos estándar de ambas escalas (0-21 GAD-7, 0-27 PHQ-9).
// Se normaliza a 0-27 para compartir el mismo eje Y.
const MAX_PUNTAJE = 27
const ALTO = 60
const ANCHO = 320
const PADDING = 8

function construirPuntos(datos: EscalaSeguimiento[]) {
  if (datos.length === 0) return ''
  const paso = datos.length > 1 ? (ANCHO - PADDING * 2) / (datos.length - 1) : 0
  return datos
    .map((d, i) => {
      const x = PADDING + i * paso
      const y = ALTO - PADDING - (d.puntaje / MAX_PUNTAJE) * (ALTO - PADDING * 2)
      return `${x},${y}`
    })
    .join(' ')
}

function SerieEscala({ tipo, datos }: { tipo: TipoEscala; datos: EscalaSeguimiento[] }) {
  if (datos.length === 0) return null
  const puntos = construirPuntos(datos)
  const ultimo = datos[datos.length - 1]

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-medium text-sage-700">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: COLOR_POR_TIPO[tipo] }}
          />
          {tipo}
        </span>
        <span className="text-xs text-sage-500">Último: {ultimo.puntaje}</span>
      </div>
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="w-full">
        <polyline
          points={puntos}
          fill="none"
          stroke={COLOR_POR_TIPO[tipo]}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {datos.map((d, i) => {
          const paso = datos.length > 1 ? (ANCHO - PADDING * 2) / (datos.length - 1) : 0
          const x = PADDING + i * paso
          const y = ALTO - PADDING - (d.puntaje / MAX_PUNTAJE) * (ALTO - PADDING * 2)
          return <circle key={d.id} cx={x} cy={y} r="2.5" fill={COLOR_POR_TIPO[tipo]} />
        })}
      </svg>
    </div>
  )
}

export function GraficoEscalas({ escalas }: { escalas: EscalaSeguimiento[] }) {
  const gad7 = escalas.filter((e) => e.tipo === 'GAD-7')
  const phq9 = escalas.filter((e) => e.tipo === 'PHQ-9')

  if (gad7.length === 0 && phq9.length === 0) {
    return <p className="text-sm text-sage-500">Sin escalas registradas todavía.</p>
  }

  return (
    <div className="space-y-4">
      <SerieEscala tipo="GAD-7" datos={gad7} />
      <SerieEscala tipo="PHQ-9" datos={phq9} />
    </div>
  )
}
