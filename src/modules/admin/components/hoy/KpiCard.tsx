import type { ReactNode } from 'react'

const tonos = {
  sage: 'bg-sage-100 text-sage-700',
  terracotta: 'bg-terracotta-100 text-terracotta-600',
  cream: 'bg-cream-200 text-sage-800',
}

/** Tarjeta de indicador: icono con acento, cifra grande y, si aplica, progreso real. */
export function KpiCard({
  titulo,
  valor,
  detalle,
  icono,
  tono = 'sage',
  progreso,
}: {
  titulo: string
  valor: ReactNode
  detalle?: string
  icono: ReactNode
  tono?: keyof typeof tonos
  progreso?: number
}) {
  return (
    <div className="rounded-3xl border border-cream-300/70 bg-cream-50 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tonos[tono]}`} aria-hidden="true">
          {icono}
        </span>
        <p className="text-sm text-sage-700">{titulo}</p>
      </div>
      <p className="font-serif-brand mt-4 text-3xl text-sage-900">{valor}</p>
      {progreso !== undefined && (
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-sage-100"
          role="progressbar"
          aria-valuenow={Math.round(progreso * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={titulo}
        >
          <div
            className="h-full rounded-full bg-sage-600 transition-all duration-700"
            style={{ width: `${Math.round(progreso * 100)}%` }}
          />
        </div>
      )}
      {detalle && <p className="mt-2 text-xs text-sage-600">{detalle}</p>}
    </div>
  )
}
