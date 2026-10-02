import { useFinanzas } from '../hooks/useFinanzas'

export function FinanzasPage() {
  const { finanzas, cargando } = useFinanzas()

  if (cargando) {
    return <p className="p-8 text-cream-300">Cargando finanzas...</p>
  }

  if (!finanzas) {
    return <p className="p-8 text-terracotta-300">No se pudo cargar la información.</p>
  }

  if (!finanzas.precioConfigurado) {
    return (
      <section className="p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-cream-50">Finanzas</h1>
        <p className="mt-4 text-terracotta-300">
          Configura tu precio de sesión para ver el detalle financiero del mes.
        </p>
      </section>
    )
  }

  return (
    <section className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-cream-50">Finanzas</h1>
      <p className="mt-1 text-sm text-cream-300">Mes en curso</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-forest-700 bg-forest-800 p-5">
          <p className="text-2xl font-semibold text-cream-50">Bs {finanzas.ingresoConfirmado}</p>
          <p className="mt-1 text-xs text-cream-300">
            Ingreso confirmado · {finanzas.sesionesPagadas} sesión
            {finanzas.sesionesPagadas !== 1 ? 'es' : ''} pagada
            {finanzas.sesionesPagadas !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="rounded-xl border border-terracotta-400/60 bg-terracotta-500/10 p-5">
          <p className="text-2xl font-semibold text-cream-50">Bs {finanzas.pendienteDeCobro}</p>
          <p className="mt-1 text-xs text-terracotta-200">
            Pendiente de cobro · {finanzas.pagosPendientes} horario
            {finanzas.pagosPendientes !== 1 ? 's' : ''} confirmado
            {finanzas.pagosPendientes !== 1 ? 's' : ''} sin pago
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs text-cream-300/70">
        Precio de sesión configurado: Bs {finanzas.precioSesion}. El pendiente de cobro asume el
        adelanto del 50% por horario confirmado.
      </p>
    </section>
  )
}
