import { useUser } from '@clerk/clerk-react'
import { LineasFondo } from '../../shared/components/LineasFondo'
import { AgendaSabado } from '../components/hoy/AgendaSabado'
import { Atencion } from '../components/hoy/Atencion'
import { esActivo } from '../components/hoy/estados'
import { KpiCard } from '../components/hoy/KpiCard'
import { usePacientesEnRiesgo } from '../hooks/usePacientesEnRiesgo'
import { useResumenMes } from '../hooks/useResumenMes'
import { useSlotsSabado } from '../hooks/useSlotsSabado'
import { useTareas } from '../hooks/useTareas'

function saludoSegunHora() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

const icono = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function HoyPage() {
  const { user } = useUser()
  const { slots, cargando: cargandoSlots, error: errorSlots, recargar, aplicarAccion } = useSlotsSabado()
  const { pacientes: enRiesgo } = usePacientesEnRiesgo()
  const { resumen } = useResumenMes()
  const { tareas, cambiarEstado } = useTareas()

  const activos = slots.filter((s) => esActivo(s.estado)).length
  const porConfirmar = slots.filter((s) => s.estado === 'solicitada').length
  const sinPago = slots.filter((s) => s.estado === 'confirmada').length

  const primeraFecha = slots[0]?.fecha
  const fechaTexto = primeraFecha
    ? new Date(primeraFecha.length === 10 ? `${primeraFecha}T12:00:00` : primeraFecha).toLocaleDateString('es-BO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : null

  const resumenFrase = cargandoSlots
    ? 'Preparando tu día...'
    : slots.length === 0
      ? 'Aún no hay horarios generados para el próximo sábado.'
      : porConfirmar > 0
        ? `Tienes ${porConfirmar} ${porConfirmar === 1 ? 'solicitud' : 'solicitudes'} por confirmar para el próximo sábado.`
        : sinPago > 0
          ? `${sinPago} ${sinPago === 1 ? 'horario confirmado espera' : 'horarios confirmados esperan'} su pago.`
          : activos > 0
            ? `El próximo sábado tienes ${activos} ${activos === 1 ? 'sesión' : 'sesiones'}. Todo está al día.`
            : 'El próximo sábado aún no tiene reservas. Tus horarios están publicados.'

  const nombre = user?.firstName ?? 'Rebeca'

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-sage-800 px-6 py-8 text-cream-50 md:px-10 md:py-10">
        <LineasFondo variante="ondas" className="inset-0 h-full w-full text-sage-600/60" />
        <div className="relative">
          <h1 className="font-serif-brand text-3xl md:text-4xl">
            {saludoSegunHora()}, {nombre}
          </h1>
          <p className="mt-2 max-w-xl text-sage-100">{resumenFrase}</p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          titulo="Ocupación del sábado"
          valor={`${activos} de ${slots.length || 8}`}
          detalle="cupos con reserva"
          progreso={slots.length ? activos / slots.length : 0}
          icono={icono('M4 6h16M4 12h16M4 18h10')}
        />
        <KpiCard
          titulo="Sesiones este mes"
          valor={resumen?.sesionesDadas ?? '-'}
          icono={icono('M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z')}
          tono="cream"
        />
        <KpiCard
          titulo="Pacientes activos"
          valor={resumen?.pacientesActivos ?? '-'}
          icono={icono('M12 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM5 20c0-3.5 3.1-6 7-6s7 2.5 7 6')}
        />
        <KpiCard
          titulo="Ingreso estimado"
          valor={resumen?.precioConfigurado ? `Bs ${resumen.ingresoEstimado}` : '-'}
          detalle={resumen && !resumen.precioConfigurado ? 'Configura el precio de sesión' : undefined}
          icono={icono('M12 3v18M7 7h7a3 3 0 010 6H8a3 3 0 000 6h8')}
          tono="terracotta"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <AgendaSabado
          slots={slots}
          cargando={cargandoSlots}
          error={errorSlots}
          fechaTexto={fechaTexto}
          onAccion={aplicarAccion}
          onReintentar={recargar}
        />
        <Atencion enRiesgo={enRiesgo} tareas={tareas} onHecha={(id) => cambiarEstado(id, 'hecha')} />
      </div>
    </div>
  )
}
