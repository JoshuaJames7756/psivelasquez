import { Link } from 'react-router-dom'
import { LineasFondo } from '../../shared/components/LineasFondo'
import { linkWhatsApp } from '../../shared/utils/whatsapp'
import { useSeguimiento } from '../hooks/useSeguimiento'
import { tarjeta } from '../utils/estilos'

const fechaCorta = (f: string) =>
  new Date(f.length === 10 ? `${f}T12:00:00` : f).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })

function Grupo({
  titulo,
  descripcion,
  tono,
  children,
}: {
  titulo: string
  descripcion: string
  tono: string
  children: React.ReactNode
}) {
  return (
    <section className={`${tarjeta} overflow-hidden`}>
      <div className={`px-5 py-4 ${tono}`}>
        <h2 className="font-serif-brand text-xl text-sage-900">{titulo}</h2>
        <p className="text-sm text-sage-700">{descripcion}</p>
      </div>
      <ul className="divide-y divide-cream-300/50">{children}</ul>
    </section>
  )
}

const wa = 'rounded-full bg-sage-700 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-sage-800'

export function SeguimientoPage() {
  const { datos, cargando } = useSeguimiento()

  if (cargando) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-busy="true">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-sage-100" />
        <div className="h-40 animate-pulse rounded-3xl bg-sage-100" />
      </div>
    )
  }
  if (!datos) {
    return <p className="mx-auto max-w-3xl text-terracotta-600">No se pudo cargar el seguimiento. Recarga la página.</p>
  }

  const nada = datos.solicitadas.length === 0 && datos.confirmadasSinPago.length === 0 && datos.pacientesEnRiesgo.length === 0

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif-brand text-3xl text-sage-900">Seguimiento</h1>
        <p className="text-sm text-sage-600">Lo que necesita tu atención, en un solo lugar.</p>
      </div>

      {nada && (
        <div className={`${tarjeta} relative overflow-hidden px-6 py-12 text-center`}>
          <LineasFondo variante="ondas" className="inset-0 h-full w-full" />
          <div className="relative">
            <p className="font-serif-brand text-2xl text-sage-900">Todo al día</p>
            <p className="mt-2 text-sm text-sage-700">No hay solicitudes, pagos ni pacientes por retomar.</p>
          </div>
        </div>
      )}

      {datos.solicitadas.length > 0 && (
        <Grupo titulo="Por confirmar" descripcion="Pidieron un horario y esperan tu respuesta." tono="bg-terracotta-50">
          {datos.solicitadas.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <span className="text-sm text-sage-900">
                <span className="font-medium">{s.paciente_nombre}</span>
                <span className="text-sage-600"> · {fechaCorta(s.fecha)}, {s.hora_inicio.slice(0, 5)}</span>
              </span>
              <span className="flex items-center gap-2">
                <Link to="/admin/agenda" className="text-xs font-medium text-sage-700 underline">Ir a Agenda</Link>
                {s.paciente_telefono && (
                  <a href={linkWhatsApp(s.paciente_telefono)} target="_blank" rel="noreferrer" className={wa}>WhatsApp</a>
                )}
              </span>
            </li>
          ))}
        </Grupo>
      )}

      {datos.confirmadasSinPago.length > 0 && (
        <Grupo titulo="Esperando el comprobante" descripcion="Horario confirmado, falta el adelanto." tono="bg-sage-100">
          {datos.confirmadasSinPago.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <span className="text-sm text-sage-900">
                <span className="font-medium">{s.paciente_nombre}</span>
                <span className="text-sage-600"> · {fechaCorta(s.fecha)}, {s.hora_inicio.slice(0, 5)}</span>
              </span>
              <span className="flex items-center gap-2">
                <Link to="/admin/agenda" className="text-xs font-medium text-sage-700 underline">Ir a Agenda</Link>
                {s.paciente_telefono && (
                  <a href={linkWhatsApp(s.paciente_telefono)} target="_blank" rel="noreferrer" className={wa}>WhatsApp</a>
                )}
              </span>
            </li>
          ))}
        </Grupo>
      )}

      {datos.pacientesEnRiesgo.length > 0 && (
        <Grupo titulo="Pacientes a retomar" descripcion="Llevan semanas sin una sesión agendada." tono="bg-cream-200/60">
          {datos.pacientesEnRiesgo.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <span className="text-sm text-sage-900">
                <span className="font-medium">{p.nombre}</span>
                <span className="text-sage-600"> · última sesión {fechaCorta(p.ultima_cita_confirmada)}</span>
              </span>
              {p.telefono && (
                <a
                  href={linkWhatsApp(p.telefono, `Hola ${p.nombre.split(' ')[0]}, ¿cómo estás? Quería saber si te gustaría retomar tu proceso.`)}
                  target="_blank"
                  rel="noreferrer"
                  className={wa}
                >
                  WhatsApp
                </a>
              )}
            </li>
          ))}
        </Grupo>
      )}
    </div>
  )
}
