import { Link } from 'react-router-dom'
import { CabeceraPagina } from '../../shared/components/CabeceraPagina'

/**
 * Redactado por Xion en la voz de Rebeca con criterios habituales de
 * ética profesional en psicología. Es un texto con peso ético y legal:
 * los puntos marcados en CONTENIDO_A_REVISAR.md (límites de la
 * confidencialidad, uso de WhatsApp, urgencias) deben ser confirmados
 * por ella antes de quitar el noindex en sitio.ts.
 */
const apartados = [
  {
    titulo: 'Información, no consulta',
    texto:
      'Lo que publico en este sitio tiene fines informativos. No sustituye una evaluación ni una atención psicológica profesional, y no sirve para diagnosticarte a ti ni a nadie más.',
  },
  {
    titulo: 'Todo proceso empieza con una evaluación',
    texto:
      'Antes de definir cómo trabajar, conversamos y evaluamos tu situación. Con esa información decidimos juntos si mi enfoque es adecuado para lo que necesitas.',
  },
  {
    titulo: 'Confidencialidad',
    texto:
      'Lo que conversamos en sesión es confidencial. Guardo tus datos y mis notas con medidas de seguridad y solo las uso para acompañar tu proceso. Para saber qué datos se piden al reservar y cómo se protegen, puedes leer la política de privacidad.',
    enlace: { to: '/privacidad', texto: 'Política de privacidad' },
  },
  {
    titulo: 'Límites de la confidencialidad',
    texto:
      'Existen excepciones acotadas: si hay un riesgo serio e inmediato para tu vida o la de otra persona, o si una autoridad competente lo exige legalmente. En esos casos compartiría solo lo mínimo necesario y, siempre que sea posible, te lo explicaría antes.',
  },
  {
    titulo: 'Este no es un servicio de urgencias',
    texto:
      'Atiendo con cita previa. Si estás viviendo una crisis o piensas en hacerte daño, no esperes a tu sesión: acude a un servicio de emergencias o busca de inmediato a una persona de confianza.',
  },
  {
    titulo: 'Sin promesas de resultados',
    texto:
      'Cada persona y cada proceso son distintos, por eso no prometo resultados ni plazos exactos. Lo que sí me comprometo a hacer es trabajar con seriedad, con respeto y con honestidad sobre lo que está funcionando y lo que no.',
  },
  {
    titulo: 'Trabajo dentro de mi formación',
    texto:
      'Ofrezco atención dentro de mi formación y experiencia. Si tu situación requiere otro tipo de apoyo, te lo diré y te orientaré hacia el profesional o el servicio adecuado.',
  },
  {
    titulo: 'WhatsApp es para coordinar',
    texto:
      'Uso WhatsApp para coordinar horarios, reservas y pagos. Te pido no enviar por ahí información clínica detallada: eso lo conversamos en sesión.',
  },
]

export function AvisoEticoPage() {
  return (
    <main>
      <CabeceraPagina
        etiqueta="Ética profesional"
        titulo="Aviso ético"
        intro="Cómo cuido tu información y los límites de lo que ofrezco, dicho de forma clara."
        estilo="circulos"
        tono="crema"
      />
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-6">
        <div className="divide-y divide-sage-200">
          {apartados.map((a) => (
            <section key={a.titulo} className="py-6">
              <h2 className="font-serif-brand text-xl text-sage-900">{a.titulo}</h2>
              <p className="mt-2 leading-relaxed text-sage-700">{a.texto}</p>
              {a.enlace && (
                <Link
                  to={a.enlace.to}
                  className="mt-2 inline-block text-sm font-medium text-sage-700 underline decoration-terracotta-300 underline-offset-4 hover:text-sage-900"
                >
                  {a.enlace.texto}
                </Link>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
