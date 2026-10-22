import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

interface ItemPregunta {
  pregunta: string
  respuesta: string
}

const preguntas: ItemPregunta[] = [
  {
    pregunta: '¿Cómo sé si necesito iniciar un proceso psicológico?',
    respuesta:
      'No hace falta esperar una crisis para empezar. Si sientes que algo te pesa más de lo que puedes manejar solo, ya es una buena razón para conversarlo. Escríbeme y vemos juntos si esto es lo que necesitas.',
  },
  {
    pregunta: '¿Tengo que saber exactamente qué me pasa?',
    respuesta:
      'No. No necesitas un diagnóstico ni saber ponerle nombre a lo que sientes. Con que algo te esté pesando es suficiente para empezar; entenderlo es parte del trabajo que hacemos juntos.',
  },
  {
    pregunta: '¿Será incómodo hablar de esto?',
    respuesta:
      'Es normal sentir nervios al empezar. Vamos a tu ritmo: puedes contarme lo que te sientas cómodo de compartir y dejar para después lo que todavía no. No tienes que hablar de todo en la primera sesión.',
  },
  {
    pregunta: '¿Qué pasa si nunca he ido a terapia?',
    respuesta:
      'Muchas personas llegan por primera vez. En la primera sesión te explico cómo trabajamos, conversamos sobre lo que te trae y resuelves tus dudas. Después decidimos juntos cómo seguir.',
  },
  {
    pregunta: '¿Con qué frecuencia son las sesiones?',
    respuesta:
      'Como atiendo un solo día a la semana, lo habitual es una sesión semanal o quincenal. La frecuencia exacta la definimos juntos después de la primera sesión, según tu proceso.',
  },
  {
    pregunta: '¿La atención es presencial u online?',
    respuesta:
      'Ambas. Puedes elegir la modalidad que prefieras al reservar tu cupo, presencial en Edif. VyV NUR (Cochabamba) u online.',
  },
  {
    pregunta: '¿Por qué piden un adelanto para reservar?',
    respuesta:
      'Atiendo solo 8 cupos por semana, así que el adelanto del 50% protege tu horario y evita que alguien más lo tome mientras coordinamos. El saldo se conversa por WhatsApp.',
  },
  {
    pregunta: '¿Qué pasa después de reservar?',
    respuesta:
      'Tu horario queda solicitado y te escribo por WhatsApp para coordinar el adelanto. Cuando envías el comprobante, confirmo tu cita. Si no se confirma dentro del plazo indicado, el horario se libera para otra persona.',
  },
  {
    pregunta: '¿Qué pasa si necesito cancelar o cambiar mi cita?',
    respuesta:
      'Escríbeme por WhatsApp apenas lo sepas y buscamos otro horario disponible. Entiendo que surgen imprevistos, solo te pido avisar con la mayor anticipación posible para poder ofrecer el cupo a alguien más.',
  },
  {
    pregunta: '¿Lo que cuento es confidencial?',
    respuesta:
      'Sí. Lo que conversamos en sesión es confidencial, con excepciones muy acotadas que explico en el aviso ético. También puedes leer qué datos se piden al reservar en la política de privacidad.',
  },
  {
    pregunta: '¿Atiendes adolescentes?',
    respuesta:
      'Trabajo con adolescentes y adultos. En el caso de menores de edad, coordinamos con su madre, padre o tutor.',
  },
  {
    pregunta: '¿Puedes recetarme medicamentos?',
    respuesta:
      'No, como psicóloga no receto medicamentos. Si en algún momento vemos que sería útil una valoración médica o psiquiátrica, te lo comento y te oriento.',
  },
]

function ItemFaq({ pregunta, respuesta }: ItemPregunta) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="py-5">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-center justify-between text-left font-medium text-sage-800"
      >
        {pregunta}
        <motion.span
          animate={{ rotate: abierto ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 text-sage-400"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08, duration: 0.25 }}
              className="mt-3 text-sage-700"
            >
              {respuesta}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Respuestas redactadas por Xion en la voz de Rebeca a partir de lo que el
 * documento rector establece (flujo de reserva, adelanto 50%, modalidad,
 * 8 cupos por semana, adolescentes y adultos). Las que tocan criterio
 * clínico o políticas propias están en CONTENIDO_A_REVISAR.md.
 *
 * nivelTitulo: este componente vive en dos contextos con jerarquía
 * distinta — como sección de HomePage (donde el <h1> real está en
 * Hero.tsx, así que acá corresponde <h2>) y como página completa
 * en FaqPage.tsx (donde esto ES el título principal, <h1>).
 */
export function Faq({
  nivelTitulo = 'h2',
  conTitulo = true,
}: {
  nivelTitulo?: 'h1' | 'h2'
  conTitulo?: boolean
}) {
  const Titulo = nivelTitulo

  return (
    <section className={`mx-auto max-w-3xl px-6 ${conTitulo ? 'py-20' : 'pb-20 pt-6'}`}>
      {conTitulo && (
        <Titulo className="font-serif-brand text-3xl text-sage-900">
          Preguntas frecuentes
        </Titulo>
      )}
      <div className={`${conTitulo ? 'mt-8' : ''} divide-y divide-sage-200`}>
        {preguntas.map((item) => (
          <ItemFaq key={item.pregunta} {...item} />
        ))}
      </div>
    </section>
  )
}
