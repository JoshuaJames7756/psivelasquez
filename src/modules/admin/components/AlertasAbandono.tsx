import { motion } from 'motion/react'
import { linkWhatsApp } from '../../shared/utils/whatsapp'
import type { PacienteEnRiesgo } from '../hooks/usePacientesEnRiesgo'

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })
}

export function AlertasAbandono({ pacientes }: { pacientes: PacienteEnRiesgo[] }) {
  if (pacientes.length === 0) return null

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-cream-50">Posible abandono</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {pacientes.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded-xl border-2 border-terracotta-400 bg-terracotta-500/10 p-4"
          >
            <div>
              <p className="font-medium text-cream-50">{p.nombre}</p>
              <p className="text-xs text-terracotta-200">
                Última sesión: {formatearFecha(p.ultima_cita_confirmada)}
              </p>
            </div>
            {p.telefono && (
              <a
                href={linkWhatsApp(
                  p.telefono,
                  `Hola ${p.nombre.split(' ')[0]}, ¿cómo estás? Quería saber si te gustaría retomar tu proceso.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-full bg-sage-600 px-4 py-2 text-sm font-medium text-cream-50 hover:bg-sage-500"
              >
                WhatsApp
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
