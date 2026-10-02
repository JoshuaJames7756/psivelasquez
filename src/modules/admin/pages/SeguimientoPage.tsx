import { linkWhatsApp } from '../../shared/utils/whatsapp'
import { useSeguimiento } from '../hooks/useSeguimiento'

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })
}

export function SeguimientoPage() {
  const { datos, cargando } = useSeguimiento()

  if (cargando) {
    return <p className="p-8 text-cream-300">Cargando seguimiento...</p>
  }

  if (!datos) {
    return <p className="p-8 text-terracotta-300">No se pudo cargar el seguimiento.</p>
  }

  const nada =
    datos.solicitadas.length === 0 &&
    datos.confirmadasSinPago.length === 0 &&
    datos.pacientesEnRiesgo.length === 0

  return (
    <section className="space-y-10 p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-cream-50">Seguimiento</h1>

      {nada && <p className="text-cream-300">Nada pendiente de tu atención ahora mismo.</p>}

      {datos.solicitadas.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-cream-300">
            Esperando que confirmes el horario
          </h2>
          <div className="space-y-2">
            {datos.solicitadas.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-terracotta-400 bg-terracotta-500/10 p-3"
              >
                <span className="text-sm text-cream-50">
                  {s.paciente_nombre} — {s.hora_inicio.slice(0, 5)}
                </span>
                {s.paciente_telefono && (
                  <a
                    href={linkWhatsApp(s.paciente_telefono)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-sage-400 hover:text-sage-300"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {datos.confirmadasSinPago.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-cream-300">Esperando el comprobante</h2>
          <div className="space-y-2">
            {datos.confirmadasSinPago.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-sage-500/50 bg-sage-500/10 p-3"
              >
                <span className="text-sm text-cream-50">
                  {s.paciente_nombre} — {s.hora_inicio.slice(0, 5)}
                </span>
                {s.paciente_telefono && (
                  <a
                    href={linkWhatsApp(s.paciente_telefono)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-sage-400 hover:text-sage-300"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {datos.pacientesEnRiesgo.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-cream-300">Posible abandono</h2>
          <div className="space-y-2">
            {datos.pacientesEnRiesgo.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-forest-700 bg-forest-800 p-3"
              >
                <span className="text-sm text-cream-50">
                  {p.nombre}
                  <span className="ml-2 text-xs text-cream-300">
                    última sesión {formatearFecha(p.ultima_cita_confirmada)}
                  </span>
                </span>
                {p.telefono && (
                  <a
                    href={linkWhatsApp(
                      p.telefono,
                      `Hola ${p.nombre.split(' ')[0]}, ¿cómo estás? Quería saber si te gustaría retomar tu proceso.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-sage-400 hover:text-sage-300"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
