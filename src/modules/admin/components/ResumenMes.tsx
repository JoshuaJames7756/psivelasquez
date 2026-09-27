interface Props {
  sesionesDadas: number
  pacientesActivos: number
  precioConfigurado: boolean
  ingresoEstimado: number | null
}

export function ResumenMes({ sesionesDadas, pacientesActivos, precioConfigurado, ingresoEstimado }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-forest-700 bg-forest-800 p-4">
        <p className="text-2xl font-semibold text-cream-50">{sesionesDadas}</p>
        <p className="text-xs text-cream-300">Sesiones este mes</p>
      </div>
      <div className="rounded-xl border border-forest-700 bg-forest-800 p-4">
        <p className="text-2xl font-semibold text-cream-50">{pacientesActivos}</p>
        <p className="text-xs text-cream-300">Pacientes activos</p>
      </div>
      <div className="rounded-xl border border-forest-700 bg-forest-800 p-4">
        {precioConfigurado ? (
          <>
            <p className="text-2xl font-semibold text-cream-50">Bs {ingresoEstimado}</p>
            <p className="text-xs text-cream-300">Ingreso estimado</p>
          </>
        ) : (
          <p className="text-sm text-terracotta-300">Configura tu precio de sesión</p>
        )}
      </div>
    </div>
  )
}
