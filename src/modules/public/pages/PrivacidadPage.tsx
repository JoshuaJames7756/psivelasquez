import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CabeceraPagina } from '../../shared/components/CabeceraPagina'
import { linkWhatsApp } from '../../shared/utils/whatsapp'

// Debe coincidir con VERSION_POLITICA en server-lib/privacidad.ts
const ACTUALIZADA = '20 de octubre de 2026'
const numeroWhatsApp = '59160389762'

const secciones: { titulo: string; cuerpo: ReactNode }[] = [
  {
    titulo: 'Qué datos te pido al reservar',
    cuerpo: (
      <>
        <p>
          Tu nombre, tu edad, tu WhatsApp, un motivo breve, si es tu primera vez en terapia y si
          prefieres sesión presencial u online. Solo el nombre es obligatorio.
        </p>
        <p className="mt-3">
          Te pido que en el motivo cuentes lo mínimo. Los detalles los conversamos en sesión, no
          en este formulario.
        </p>
      </>
    ),
  },
  {
    titulo: 'Para qué los uso',
    cuerpo: (
      <p>
        Solo para coordinar tu cita por WhatsApp y, si empezamos terapia, para llevar el registro
        de tu proceso. No los uso para publicidad ni los vendo.
      </p>
    ),
  },
  {
    titulo: 'Quién puede verlos',
    cuerpo: (
      <p>
        Yo y la persona de soporte técnico que mantiene este sistema (Xion Technology), solo para
        que funcione correctamente. Nadie más tiene acceso.
      </p>
    ),
  },
  {
    titulo: 'Dónde se guardan y cómo los cuido',
    cuerpo: (
      <>
        <p>
          En servicios tecnológicos que pueden estar fuera de Bolivia: Vercel (el sitio), Neon (la
          base de datos), Clerk (el inicio de sesión del panel) y Cloudinary (imágenes y
          documentos).
        </p>
        <p className="mt-3">
          El acceso es con cuenta personal, las conexiones son cifradas, los documentos de
          pacientes son privados y se abren con enlaces que vencen a los pocos minutos, y queda un
          registro de quién abre cada ficha.
        </p>
      </>
    ),
  },
  {
    titulo: 'Cookies y servicios de terceros',
    cuerpo: (
      <p>
        El sitio solo usa el almacenamiento técnico necesario para funcionar y para el acceso
        privado del panel. No uso cookies de publicidad ni de seguimiento. El mapa de la página de
        modalidad lo carga Google, y WhatsApp pertenece a Meta: ambos se rigen por sus propias
        condiciones.
      </p>
    ),
  },
  {
    titulo: 'Cuánto tiempo los conservo',
    cuerpo: (
      <p>
        Si tu solicitud no se concreta, puedes pedir que borre tus datos cuando quieras. Si
        iniciamos un proceso terapéutico, tu registro se conserva mientras dure y el tiempo que
        exija mi práctica profesional.
      </p>
    ),
  },
  {
    titulo: 'Tus derechos',
    cuerpo: (
      <p>
        Puedes pedirme ver, corregir o eliminar tus datos escribiéndome por{' '}
        <a
          href={linkWhatsApp(numeroWhatsApp)}
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
