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
  origen,
  tono,
  vacio,
  children,
}: {
  titulo: string
  descripcion: string
  origen: string
  tono: string
  vacio: boolean
  children: React.ReactNode
}) {
  return (
    <section className={`${tarjeta} overflow-hidden`}>
      <div className={`px-5 py-4 ${tono}`}>
        <h2 className="font-serif-brand text-xl text-sage-900">{titulo}</h2>
        <p className="text-sm text-sage-700">{descripcion}</p>
        <p className="mt-1 text-xs text-sage-600">{origen}</p>
      </div>
      {vacio ? (
        <p className="px-5 py-4 text-sm text-sage-600">Nada por ahora.</p>
      ) : (
        <ul className="divide-y divide-cream-300/50">{children}</ul>
      )}
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
        <p className="mt-2 max-w-2xl rounded-2xl bg-sage-50 px-4 py-3 text-sm text-sage-800">
          Aquí no se escribe nada a mano: esta pantalla se arma sola con lo que pasa en la Agenda y en la ficha
          de cada paciente. Cuando resuelves algo allá (confirmas una cita, registras el pago o agendas una
          sesión), desaparece de aquí.
        </p>
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

      {!nada && (
        <>
        <Grupo
          titulo="Por confirmar"
          descripcion="Pidieron un horario y esperan tu respuesta."
          origen="Se llena cuando alguien solicita un horario desde la página de Reservar."
          tono="bg-terracotta-50"
          vacio={datos.solicitadas.length === 0}
        >
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

        <Grupo
          titulo="Esperando el comprobante"
          descripcion="Horario confirmado, falta el adelanto."
          origen="Se llena cuando confirmas una cita en la Agenda y aún no registras el pago."
          tono="bg-sage-100"
          vacio={datos.confirmadasSinPago.length === 0}
        >
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

        <Grupo
          titulo="Pacientes a retomar"
          descripcion="Llevan semanas sin una sesión agendada."
          origen="Se llena con pacientes activos sin cita confirmada hace 3 semanas o más."
          tono="bg-cream-200/60"
          vacio={datos.pacientesEnRiesgo.length === 0}
        >
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
        </>
      )}
    </div>
  )
}
