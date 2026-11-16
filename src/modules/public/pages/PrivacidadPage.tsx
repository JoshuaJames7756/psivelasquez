import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CabeceraPagina } from '../../shared/components/CabeceraPagina'
import { linkWhatsApp } from '../../shared/utils/whatsapp'
import { NUMERO_WHATSAPP } from '../data/contacto'

const ACTUALIZADA = '16 de noviembre de 2026'

const secciones: { titulo: string; cuerpo: ReactNode }[] = [
  {
    titulo: 'Este sitio no guarda tus datos',
    cuerpo: (
      <>
        <p>
          No hay cuentas ni base de datos. El formulario de la página de reservas solo arma un
          mensaje en tu propio dispositivo y abre WhatsApp. Lo que escribes no pasa por este sitio:
          se envía únicamente si tú tocas &laquo;enviar&raquo; en WhatsApp.
        </p>
        <p className="mt-3">
          Te pido que en el motivo cuentes lo mínimo. Los detalles los conversamos en sesión.
        </p>
      </>
    ),
  },
  {
    titulo: 'Qué pasa cuando me escribes por WhatsApp',
    cuerpo: (
      <p>
        Uso tu mensaje para coordinar tu cita y, si empezamos terapia, para acompañar tu proceso.
        No lo uso para publicidad ni lo comparto. WhatsApp pertenece a Meta y se rige por sus
        propias condiciones.
      </p>
    ),
  },
  {
    titulo: 'Cookies y servicios de terceros',
    cuerpo: (
      <>
        <p>
          No uso cookies de publicidad ni de seguimiento, ni herramientas de analítica. El sitio se
          aloja en un servicio de internet que, como cualquier servidor web, puede registrar datos
          técnicos de cada visita (por ejemplo la dirección IP) para que funcione con seguridad.
        </p>
        <p className="mt-3">
          El mapa de la página de modalidad lo carga Google, que se rige por sus propias
          condiciones.
        </p>
      </>
    ),
  },
  {
    titulo: 'Tus derechos',
    cuerpo: (
      <p>
        Puedes pedirme ver, corregir o eliminar lo que me hayas escrito escribiéndome por{' '}
        <a
          href={linkWhatsApp(NUMERO_WHATSAPP)}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-sage-800 underline hover:text-sage-600"
        >
          WhatsApp
        </a>
        . Este aviso complementa el{' '}
        <Link to="/aviso-etico" className="font-medium text-sage-800 underline hover:text-sage-600">
          aviso ético
        </Link>
        .
      </p>
    ),
  },
]

export function PrivacidadPage() {
  return (
    <main>
      <CabeceraPagina
        etiqueta="Tus datos"
        titulo="Política de privacidad"
        intro="Cómo trato la información que me compartes, dicho de forma simple."
        estilo="puntos"
        tono="crema"
        ancho="max-w-3xl"
      />
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-4">
        <div className="space-y-10">
          {secciones.map((s) => (
            <section key={s.titulo}>
              <h2 className="font-serif-brand text-xl text-sage-900">{s.titulo}</h2>
              <div className="mt-3 leading-relaxed text-sage-700">{s.cuerpo}</div>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-sage-600">Última actualización: {ACTUALIZADA}.</p>
      </div>
    </main>
  )
}
