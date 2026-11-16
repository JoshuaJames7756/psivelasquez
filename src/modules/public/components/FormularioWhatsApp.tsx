import { motion } from 'motion/react'
import { useId, useState, type FormEvent } from 'react'
import { construirMensajeReserva, linkWhatsApp, type DatosReserva } from '../../shared/utils/whatsapp'
import { NUMERO_WHATSAPP } from '../data/contacto'

const campo =
  'mt-1 w-full rounded-xl border border-sage-300 bg-white p-2.5 text-sm text-sage-900 focus:border-sage-600 focus:outline-none focus:ring-2 focus:ring-sage-200'

const horarios: { valor: DatosReserva['horario']; texto: string }[] = [
  { valor: 'cualquiera', texto: 'Cualquier horario' },
  { valor: 'manana', texto: 'Mañana (09:00 a 12:00)' },
  { valor: 'tarde', texto: 'Tarde (13:00 a 17:00)' },
]

/**
 * Reserva sin servidor: el formulario arma un mensaje y abre WhatsApp.
 * Nada se envía ni se guarda en este sitio; lo que la persona escribe solo
 * viaja a WhatsApp cuando ella toca el botón.
 */
export function FormularioWhatsApp() {
  const id = useId()
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [motivo, setMotivo] = useState('')
  const [primeraVez, setPrimeraVez] = useState(false)
  const [modalidad, setModalidad] = useState<DatosReserva['modalidad']>('presencial')
  const [horario, setHorario] = useState<DatosReserva['horario']>('cualquiera')
  const [errorNombre, setErrorNombre] = useState('')
  const [enlace, setEnlace] = useState('')

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (nombre.trim().length < 2) {
      setErrorNombre('Escribe tu nombre para que sepa quién eres.')
      return
    }
    setErrorNombre('')
    const url = linkWhatsApp(
      NUMERO_WHATSAPP,
      construirMensajeReserva({ nombre, edad, modalidad, horario, primeraVez, motivo }),
    )
    setEnlace(url)
    window.open(url, '_blank', 'noopener')
  }

  return (
    <motion.form
      onSubmit={enviar}
      noValidate
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-xl space-y-5 rounded-3xl border border-sage-200 bg-cream-50 p-6 shadow-sm md:p-8"
    >
      <div>
        <label htmlFor={`${id}-nombre`} className="text-sm font-medium text-sage-800">
          Tu nombre
        </label>
        <input
          id={`${id}-nombre`}
          autoComplete="name"
          maxLength={120}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          aria-invalid={Boolean(errorNombre)}
          aria-describedby={errorNombre ? `${id}-error` : undefined}
          className={campo}
        />
        {errorNombre && (
          <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-terracotta-600">
            {errorNombre}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-edad`} className="text-sm font-medium text-sage-800">
            Edad <span className="font-normal text-sage-600">(opcional)</span>
          </label>
          <input
            id={`${id}-edad`}
            type="number"
            inputMode="numeric"
            min={1}
            max={119}
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className={campo}
          />
        </div>
        <div>
          <label htmlFor={`${id}-horario`} className="text-sm font-medium text-sage-800">
            Horario preferido
          </label>
          <select
            id={`${id}-horario`}
            value={horario}
            onChange={(e) => setHorario(e.target.value as DatosReserva['horario'])}
            className={campo}
          >
            {horarios.map((h) => (
              <option key={h.valor} value={h.valor}>
                {h.texto}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-sage-800">Modalidad</legend>
        <div className="mt-2 flex gap-2">
          {(['presencial', 'online'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={modalidad === m}
              onClick={() => setModalidad(m)}
              className={`rounded-full border px-5 py-2 text-sm capitalize transition-colors ${
                modalidad === m
                  ? 'border-sage-700 bg-sage-700 text-cream-50'
                  : 'border-sage-300 text-sage-700 hover:bg-sage-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-sage-800">
        <input
          type="checkbox"
          checked={primeraVez}
          onChange={(e) => setPrimeraVez(e.target.checked)}
          className="h-4 w-4 accent-sage-700"
        />
        Es mi primera vez en terapia
      </label>

      <div>
        <label htmlFor={`${id}-motivo`} className="text-sm font-medium text-sage-800">
          Motivo breve <span className="font-normal text-sage-600">(opcional)</span>
        </label>
        <p className="text-xs text-sage-600">Cuéntame solo lo necesario; los detalles los vemos en sesión.</p>
        <textarea
          id={`${id}-motivo`}
          rows={2}
          maxLength={300}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className={`${campo} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-sage-700 py-3 text-base font-medium text-cream-50 shadow-sm transition-colors hover:bg-sage-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-700"
      >
        Escribirme por WhatsApp
      </button>
      <p className="text-center text-xs text-sage-600">
        Se abrirá WhatsApp con tu mensaje listo. No se guarda nada en este sitio.
      </p>

      {enlace && (
        <p role="status" className="rounded-xl bg-sage-100 p-3 text-center text-sm text-sage-800">
          Si WhatsApp no se abrió,{' '}
          <a href={enlace} target="_blank" rel="noreferrer" className="font-medium underline">
            toca aquí para abrirlo
          </a>
          .
        </p>
      )}
    </motion.form>
  )
}
