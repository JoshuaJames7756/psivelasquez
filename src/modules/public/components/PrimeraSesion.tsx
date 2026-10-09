import { LineasFondo } from '../../shared/components/LineasFondo'
import { TituloSeccion } from '../../shared/components/TituloSeccion'
/**
 * Frase adicional por paso (no inventa el proceso clínico, solo
 * aclara qué significa cada punto desde la perspectiva de quien
 * llega — pedido explícito: reducir incertidumbre sin inventar).
 */
const pasos = [
  {
    titulo: 'Contacto por WhatsApp, coordinamos el sábado',
    detalle: 'Elegís el horario que te quede bien, sin formularios largos.',
  },
  {
    titulo: 'Reserva con adelanto del 50% (protege el cupo)',
    detalle: 'Solo atiendo 8 cupos por semana, por eso se reserva así.',
  },
  {
    titulo: 'Primera sesión, sin presión de tener todo claro',
    detalle: 'No necesitás llegar con un diagnóstico o un guion armado.',
  },
  {
    titulo: 'Definimos juntos frecuencia y forma del proceso',
    detalle: 'Ahí decidimos cómo seguir, a tu ritmo.',
  },
]

export function PrimeraSesion() {
  return (
    <section className="relative overflow-hidden bg-cream-100 px-6 py-16 md:py-20">
      <LineasFondo variante="ondas" className="inset-x-0 bottom-0 h-40 w-full" />
      <div className="relative mx-auto max-w-3xl">
        <TituloSeccion>Qué esperar en tu primera sesión</TituloSeccion>
        <ol className="mt-8 space-y-5 md:mt-10 md:space-y-6">
          {pasos.map((paso, i) => (
            <li key={paso.titulo} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-700 text-sm font-semibold text-cream-50">
                {i + 1}
              </span>
              <span className="pt-1">
                <span className="block text-sage-800">{paso.titulo}</span>
                <span className="mt-0.5 block text-sm text-sage-600">{paso.detalle}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
