import { useState } from 'react'
import { useRegistrarEscala } from '../hooks/useRegistrarEscala'
import type { EscalaSeguimiento, TipoEscala } from '../../shared/types/db'

const COLOR_POR_TIPO: Record<TipoEscala, string> = {
  'GAD-7': 'var(--color-sage-500)',
  'PHQ-9': 'var(--color-terracotta-400)',
}

// Puntaje máximo de cada escala: GAD-7 va de 0 a 21, PHQ-9 de 0 a 27.
const MAX_POR_TIPO: Record<TipoEscala, number> = { 'GAD-7': 21, 'PHQ-9': 27 }
const ALTO = 60
const ANCHO = 320
const PADDING = 8

function construirPuntos(datos: EscalaSeguimiento[], max: number) {
  if (datos.length === 0) return ''
  const paso = datos.length > 1 ? (ANCHO - PADDING * 2) / (datos.length - 1) : 0
  return datos
    .map((d, i) => {
      const x = PADDING + i * paso
      const y = ALTO - PADDING - (d.puntaje / max) * (ALTO - PADDING * 2)
      return `${x},${y}`
    })
    .join(' ')
}

function SerieEscala({ tipo, datos }: { tipo: TipoEscala; datos: EscalaSeguimiento[] }) {
  if (datos.length === 0) return null
  const max = MAX_POR_TIPO[tipo]
  const puntos = construirPuntos(datos, max)
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
        <span className="text-xs text-sage-500">
          Último: {ultimo.puntaje}/{max}
        </span>
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
          const y = ALTO - PADDING - (d.puntaje / max) * (ALTO - PADDING * 2)
          return <circle key={d.id} cx={x} cy={y} r="2.5" fill={COLOR_POR_TIPO[tipo]} />
        })}
      </svg>
    </div>
  )
}

function FormularioRegistro({
  pacienteId,
  onRegistrada,
}: {
  pacienteId: string
  onRegistrada: (e: EscalaSeguimiento) => void
}) {
  const [tipo, setTipo] = useState<TipoEscala>('GAD-7')
  const [puntaje, setPuntaje] = useState('')
  const { registrar, guardando, error } = useRegistrarEscala(pacienteId, (e) => {
    onRegistrada(e)
    setPuntaje('')
  })

  function manejarSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const n = Number(puntaje)
    if (!Number.isFinite(n) || n < 0) return
    registrar(tipo, n)
  }

  return (
    <form onSubmit={manejarSubmit} className="mt-4 flex items-end gap-2">
      <div>
        <label className="text-xs text-sage-600">Escala</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoEscala)}
          className="mt-1 block rounded-lg border border-sage-200 px-2 py-1.5 text-sm"
        >
          <option value="GAD-7">GAD-7</option>
          <option value="PHQ-9">PHQ-9</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-sage-600">Puntaje</label>
        <input
          type="number"
          min={0}
          max={MAX_POR_TIPO[tipo]}
          value={puntaje}
          onChange={(e) => setPuntaje(e.target.value)}
          className="mt-1 block w-20 rounded-lg border border-sage-200 px-2 py-1.5 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={guardando || puntaje === ''}
        className="rounded-lg bg-sage-700 px-3 py-1.5 text-sm font-medium text-cream-50 hover:bg-sage-800 disabled:opacity-50"
      >
        {guardando ? '...' : 'Registrar'}
      </button>
      {error && <p className="text-xs text-terracotta-600">{error}</p>}
    </form>
  )
}

export function GraficoEscalas({
  pacienteId,
  escalasIniciales,
}: {
  pacienteId: string
  escalasIniciales: EscalaSeguimiento[]
}) {
  const [escalas, setEscalas] = useState(escalasIniciales)
  const gad7 = escalas.filter((e) => e.tipo === 'GAD-7')
  const phq9 = escalas.filter((e) => e.tipo === 'PHQ-9')

  return (
    <div>
      {gad7.length === 0 && phq9.length === 0 ? (
        <p className="text-sm text-sage-500">Sin escalas registradas todavía.</p>
      ) : (
        <div className="space-y-4">
          <SerieEscala tipo="GAD-7" datos={gad7} />
          <SerieEscala tipo="PHQ-9" datos={phq9} />
        </div>
      )}
      <FormularioRegistro
        pacienteId={pacienteId}
        onRegistrada={(e) => setEscalas((prev) => [...prev, e])}
      />
    </div>
  )
}
