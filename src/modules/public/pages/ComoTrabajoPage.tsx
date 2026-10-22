import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CabeceraPagina } from '../../shared/components/CabeceraPagina'

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, delay },
})

/**
 * Texto redactado por Xion en la voz de Rebeca a partir de lo que el
 * documento rector establece: enfoque cognitivo-conductual y el recorrido
 * conocer, comprender, trabajar, medir, ajustar. Los puntos que describen
 * su práctica concreta están marcados en CONTENIDO_A_REVISAR.md para que
 * ella los confirme antes de quitar el noindex en sitio.ts.
 */
const pasos = [
  {
    titulo: 'Conocer',
    texto:
      'Primero escucho. En las primeras sesiones conversamos sobre qué te trajo, cómo ha sido tu historia con esto y qué esperas del proceso. No necesitas llegar con todo claro.',
  },
  {
    titulo: 'Comprender',
    texto:
      'Armamos juntos una comprensión de lo que te pasa: qué lo activa, cómo lo vives y qué lo mantiene. Es una guía para trabajar, no una etiqueta sobre ti.',
  },
  {
    titulo: 'Trabajar',
    texto:
      'Definimos objetivos acordados y trabajamos en ellos con herramientas prácticas. A veces te propondré pequeñas actividades para probar en tu día a día, siempre con tu acuerdo.',
  },
  {
    titulo: 'Medir',
    texto:
      'Para ver cómo avanzas, revisamos juntos cómo te has sentido con el tiempo. Cuando resulta útil, uso escalas breves y estandarizadas, como el GAD-7 para ansiedad o el PHQ-9 para ánimo. Son una guía de seguimiento, no un diagnóstico.',
  },
  {
    titulo: 'Ajustar',
    texto:
      'Un proceso no es una receta fija. Si algo no te está funcionando, lo revisamos y lo cambiamos: la frecuencia, los objetivos y las herramientas se adaptan a ti.',
  },
]

const compromisos = [
  'Escucharte con respeto y sin juicio.',
  'Explicarte con claridad qué hacemos y para qué.',
  'Cuidar la confidencialidad de lo que conversamos.',
  'No prometerte resultados ni plazos exactos: cada proceso es distinto.',
]

export function ComoTrabajoPage() {
  return (
    <main>
      <CabeceraPagina
        etiqueta="Metodología"
        titulo="Cómo trabajo"
        intro="Mi trabajo parte principalmente del enfoque cognitivo-conductual: miramos cómo se relacionan lo que ocurre, lo que piensas, lo que sientes y lo que haces, para encontrar cambios concretos y posibles."
        estilo="rama"
        tono="sage"
      />
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-6">
        <p className="text-lg leading-relaxed text-sage-700">
          No es un proceso en el que yo decido y tú escuchas. Es un trabajo en equipo: tú conoces
          tu vida, y yo aporto herramientas y una mirada profesional para ordenar lo que
          está pasando.
        </p>

        <ol className="mt-10 space-y-6">
          {pasos.map((paso, i) => (
            <motion.li
              key={paso.titulo}
              {...reveal()}
              className="flex gap-4 rounded-3xl border border-sage-200 bg-cream-50 p-5 md:p-6"
            >
              <span
                aria-hidden="true"
                className="font-serif-brand text-3xl leading-none text-terracotta-400"
              >
                {i + 1}
              </span>
              <div>
                <h2 className="font-serif-brand text-xl text-sage-900">{paso.titulo}</h2>
                <p className="mt-1 text-sage-700">{paso.texto}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.section {...reveal()} className="mt-12 rounded-3xl bg-sage-100 p-6 md:p-8">
          <h2 className="font-serif-brand text-2xl text-sage-900">Lo que puedes esperar de mí</h2>
          <ul className="mt-4 space-y-2 text-sage-800">
            {compromisos.map((c) => (
              <li key={c} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-400" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-sage-700">
            Si lo que necesitas excede lo que puedo ofrecerte, te lo diré con claridad y, cuando
            haga falta, te orientaré hacia otro tipo de atención, por ejemplo una valoración
            médica o psiquiátrica. Puedes leer más en el{' '}
            <Link to="/aviso-etico" className="underline decoration-terracotta-300 underline-offset-4">
              aviso ético
            </Link>
            .
          </p>
        </motion.section>

        <div className="mt-10 text-center">
          <Link
            to="/reservar"
            className="inline-block rounded-full bg-sage-700 px-8 py-3 text-base font-medium text-cream-50 shadow-sm transition-colors hover:bg-sage-800"
          >
            Reservar una sesión
          </Link>
        </div>
      </div>
    </main>
  )
}
