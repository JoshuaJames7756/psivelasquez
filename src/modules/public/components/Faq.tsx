import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

interface ItemPregunta {
  pregunta: string
  respuesta: string
}

const preguntas: ItemPregunta[] = [
  {
    pregunta: '¿Cómo sé si necesito iniciar un proceso psicológico?',
    // Respuesta genérica y prudente a propósito: no es un diagnóstico,
    // solo invita a escribir. Contenido clínico real, revisar con Rebeca.
    respuesta:
      'No hace falta esperar una crisis para empezar. Si sientes que algo te pesa más de lo que puedes manejar solo, ya es una buena razón para conversarlo. Escríbeme y vemos juntos si esto es lo que necesitas.',
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
    pregunta: '¿Qué pasa si necesito cancelar o cambiar mi cita?',
    respuesta:
      'Escríbeme por WhatsApp apenas lo sepas y buscamos otro horario disponible. Entiendo que surgen imprevistos, solo te pido avisar con la mayor anticipación posible para poder ofrecer el cupo a alguien más.',
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
 * Respuestas redactadas a partir de lo que el doc ya establece
 * (flujo de reserva, adelanto 50%, modalidad, 8 cupos/semana).
 * La primera pregunta ("¿cómo sé si necesito...") es la única con
 * contenido clínico real de fondo — se mantuvo deliberadamente
 * genérica (invita a escribir, no diagnostica) pero de todos modos
 * Rebeca debería revisarla y ajustarla a su propio criterio clínico
 * antes de publicar.
 *
 * nivelTitulo: este componente vive en dos contextos con jerarquía
 * distinta — como sección de HomePage (donde el <h1> real está en
 * Hero.tsx, así que acá corresponde <h2>) y como página completa
 * en FaqPage.tsx (donde esto ES el título principal, <h1>).
 */
export function Faq({ nivelTitulo = 'h2' }: { nivelTitulo?: 'h1' | 'h2' }) {
  const Titulo = nivelTitulo

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <Titulo className="font-[var(--font-serif-brand)] text-3xl text-sage-900">
        Preguntas frecuentes
      </Titulo>
      <div className="mt-8 divide-y divide-sage-200">
        {preguntas.map((item) => (
          <ItemFaq key={item.pregunta} {...item} />
        ))}
      </div>
    </section>
  )
}
