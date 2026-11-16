import { Link } from 'react-router-dom'
import { CabeceraPagina } from '../../shared/components/CabeceraPagina'
import { FormularioWhatsApp } from '../components/FormularioWhatsApp'

export function ReservarPage() {
  return (
    <main>
      <CabeceraPagina
        etiqueta="Primer paso"
        titulo="Reservar una sesión"
        intro="Cuéntame lo básico y se abrirá WhatsApp con tu mensaje listo. Te responderé para coordinar el horario."
        estilo="ondas"
        tono="sage"
        ancho="max-w-4xl"
      />
      <div className="px-6 pb-20 pt-4">
        <FormularioWhatsApp />
        <div className="mx-auto mt-8 max-w-xl space-y-2 text-center text-sm text-sage-700">
          <p>
            Atiendo los <strong>sábados de 09:00 a 17:00</strong>, presencial u online. Para reservar
            tu horario se coordina un adelanto del 50% por WhatsApp.
          </p>
          <p>
            ¿Prefieres escribirme directo? Usa el botón de WhatsApp del pie de página, o revisa las{' '}
            <Link to="/faq" className="font-medium underline decoration-terracotta-300 underline-offset-4">
              preguntas frecuentes
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  )
}
