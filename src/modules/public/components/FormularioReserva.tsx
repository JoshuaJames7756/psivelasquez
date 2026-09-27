import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { SlotPublico } from '../hooks/useSlotsPublicos'

interface Props {
  slot: SlotPublico | null
  onClose: () => void
  onReservado: () => void
}

type EstadoEnvio = 'inactivo' | 'enviando' | 'error'

export function FormularioReserva({ slot, onClose, onReservado }: Props) {
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [telefono, setTelefono] = useState('')
  const [motivoInicial, setMotivoInicial] = useState('')
  const [primeraVez, setPrimeraVez] = useState(true)
  const [modalidad, setModalidad] = useState<'presencial' | 'online'>('presencial')
  const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvio>('inactivo')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!slot) return

    setEstadoEnvio('enviando')
    setErrorMsg(null)

    try {
      const res = await fetch('/api/citas/solicitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: slot.id,
          nombre,
          edad: edad ? Number(edad) : undefined,
          telefono: telefono || undefined,
          motivoInicial: motivoInicial || undefined,
          primeraVez,
          modalidad,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'No se pudo completar la reserva')
      }

      onReservado()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al reservar')
      setEstadoEnvio('error')
    }
  }

  return (
    <AnimatePresence>
      {slot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-cream-50 p-6"
          >
            <h3 className="font-[var(--font-serif-brand)] text-2xl text-sage-900">
              Reservar {slot.hora_inicio.slice(0, 5)}
            </h3>
            <p className="mt-1 text-sm text-sage-600">
              Coordinamos el pago del 50% por WhatsApp una vez enviada tu reserva.
            </p>

            <form onSubmit={manejarSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-sage-600">Nombre completo</label>
                <input
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-sage-200 p-2.5 text-sm focus:border-sage-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-sage-600">Edad</label>
                  <input
                    type="number"
                    min={1}
                    max={119}
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-sage-200 p-2.5 text-sm focus:border-sage-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-sage-600">WhatsApp</label>
                  <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+591..."
                    className="mt-1 w-full rounded-lg border border-sage-200 p-2.5 text-sm focus:border-sage-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-sage-600">Motivo breve</label>
                <textarea
                  value={motivoInicial}
                  onChange={(e) => setMotivoInicial(e.target.value)}
                  rows={2}
                  className="mt-1 w-full resize-none rounded-lg border border-sage-200 p-2.5 text-sm focus:border-sage-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-sage-700">
                  <input
                    type="checkbox"
                    checked={primeraVez}
                    onChange={(e) => setPrimeraVez(e.target.checked)}
                  />
                  Primera vez en terapia
                </label>
              </div>

              <div>
                <label className="text-xs font-medium text-sage-600">Modalidad</label>
                <div className="mt-1 flex gap-2">
                  {(['presencial', 'online'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModalidad(m)}
                      className={`rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
                        modalidad === m
                          ? 'border-sage-700 bg-sage-700 text-cream-50'
                          : 'border-sage-300 text-sage-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && <p className="text-sm text-terracotta-600">{errorMsg}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full border border-sage-300 py-2.5 text-sm font-medium text-sage-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={estadoEnvio === 'enviando'}
                  className="flex-1 rounded-full bg-sage-700 py-2.5 text-sm font-medium text-cream-50 hover:bg-sage-800 disabled:opacity-60"
                >
                  {estadoEnvio === 'enviando' ? 'Enviando...' : 'Solicitar cupo'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
