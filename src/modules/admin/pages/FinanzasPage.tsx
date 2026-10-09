import { useEffect, useState } from 'react'
import { KpiCard } from '../components/hoy/KpiCard'
import { useFinanzas } from '../hooks/useFinanzas'

const icono = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function PrecioSesion({
  actual,
  onGuardar,
}: {
  actual: number | null
  onGuardar: (precio: number) => Promise<void>
}) {
  const [valor, setValor] = useState(actual?.toString() ?? '')
  const [estado, setEstado] = useState<'inactivo' | 'guardando' | 'guardado' | 'error'>('inactivo')

  useEffect(() => {
    setValor(actual?.toString() ?? '')
  }, [actual])

  const numero = Number(valor)
  const valido = valor.trim() !== '' && Number.isFinite(numero) && numero > 0 && numero <= 100000

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!valido) return
    setEstado('guardando')
    try {
      await onGuardar(numero)
      setEstado('guardado')
    } catch {
      setEstado('error')
    }
  }

  return (
    <form onSubmit={enviar} className="rounded-3xl border border-cream-300/70 bg-cream-50 p-5 shadow-sm">
      <h2 className="font-serif-brand text-xl text-sage-900">Precio de sesión</h2>
      <p className="mt-1 text-sm text-sage-600">
        No se publica en el sitio: solo se usa para estimar tus ingresos. Al cambiarlo se recalculan
        las cifras del mes.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="precio" className="text-xs font-medium text-sage-700">
            Bs por sesión
          </label>
          <input
            id="precio"
            value={valor}
            onChange={(e) => {
              setValor(e.target.value)
              setEstado('inactivo')
            }}
            inputMode="decimal"
            type="number"
            min={1}
            max={100000}
            step="any"
            className="mt-1 block w-36 rounded-xl border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-sage-900 focus:border-sage-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!valido || estado === 'guardando'}
          className="rounded-full bg-sage-700 px-5 py-2 text-sm font-medium text-cream-50 hover:bg-sage-800 disabled:opacity-40"
        >
          {estado === 'guardando' ? 'Guardando...' : 'Guardar precio'}
        </button>
        {estado === 'guardado' && <span className="text-sm text-sage-700">Guardado</span>}
        {estado === 'error' && <span className="text-sm text-terracotta-600">No se pudo guardar</span>}
      </div>
    </form>
  )
}

export function FinanzasPage() {
  const { finanzas, cargando, guardarPrecio } = useFinanzas()

  if (cargando) {
    return (
      <div className="mx-auto max-w-4xl space-y-4" aria-busy="true">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-sage-100" />
        <div className="h-32 animate-pulse rounded-3xl bg-sage-100" />
      </div>
    )
  }

  if (!finanzas) {
    return <p className="mx-auto max-w-4xl text-terracotta-600">No se pudo cargar la información. Recarga la página.</p>
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif-brand text-3xl text-sage-900">Finanzas</h1>
        <p className="text-sm text-sage-600">Mes en curso</p>
      </div>

      {finanzas.precioConfigurado ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <KpiCard
            titulo="Ingreso confirmado"
            valor={`Bs ${finanzas.ingresoConfirmado}`}
            detalle={`${finanzas.sesionesPagadas} sesión${finanzas.sesionesPagadas !== 1 ? 'es' : ''} pagada${finanzas.sesionesPagadas !== 1 ? 's' : ''}`}
            icono={icono('M12 3v18M7 7h7a3 3 0 010 6H8a3 3 0 000 6h8')}
          />
          <KpiCard
            titulo="Pendiente de cobro"
            valor={`Bs ${finanzas.pendienteDeCobro}`}
            detalle={`${finanzas.pagosPendientes} horario${finanzas.pagosPendientes !== 1 ? 's' : ''} confirmado${finanzas.pagosPendientes !== 1 ? 's' : ''} sin pago. Asume el adelanto del 50%.`}
            tono="terracotta"
            icono={icono('M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z')}
          />
        </div>
      ) : (
        <p className="rounded-2xl bg-terracotta-50 px-4 py-3 text-sm text-terracotta-600">
          Aún no configuraste tu precio de sesión. Ponlo abajo para ver tus ingresos del mes.
        </p>
      )}

      <PrecioSesion actual={finanzas.precioSesion} onGuardar={guardarPrecio} />
    </div>
  )
}
