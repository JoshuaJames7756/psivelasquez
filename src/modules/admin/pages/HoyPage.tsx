import { AlertasAbandono } from '../components/AlertasAbandono'
import { OcupacionSabado } from '../components/OcupacionSabado'
import { ResumenMes } from '../components/ResumenMes'
import { usePacientesEnRiesgo } from '../hooks/usePacientesEnRiesgo'
import { useResumenMes } from '../hooks/useResumenMes'
import { useSlotsSabado } from '../hooks/useSlotsSabado'

export function HoyPage() {
  const { slots, cargando: cargandoSlots, confirmar, liberar } = useSlotsSabado()
  const { pacientes: enRiesgo, cargando: cargandoRiesgo } = usePacientesEnRiesgo()
  const { resumen, cargando: cargandoResumen } = useResumenMes()

  return (
    <section className="space-y-10 p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-cream-50">Hoy</h1>

      {cargandoSlots ? (
        <p className="text-cream-300">Cargando cupos...</p>
      ) : (
        <OcupacionSabado slots={slots} onConfirmar={confirmar} onLiberar={liberar} />
      )}

      {!cargandoRiesgo && enRiesgo.length > 0 && <AlertasAbandono pacientes={enRiesgo} />}

      {!cargandoResumen && resumen && (
        <ResumenMes
          sesionesDadas={resumen.sesionesDadas}
          pacientesActivos={resumen.pacientesActivos}
          precioConfigurado={resumen.precioConfigurado}
          ingresoEstimado={resumen.ingresoEstimado}
        />
      )}
    </section>
  )
}
