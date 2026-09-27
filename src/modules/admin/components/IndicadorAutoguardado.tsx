import { AnimatePresence, motion } from 'motion/react'
import type { EstadoAutoguardado } from '../hooks/useAutoguardadoHistorial'

const textoPorEstado: Record<Exclude<EstadoAutoguardado, 'inactivo'>, string> = {
  guardando: 'Guardando...',
  guardado: 'Guardado',
  error: 'No se pudo guardar',
}

export function IndicadorAutoguardado({ estado }: { estado: EstadoAutoguardado }) {
  return (
    <AnimatePresence>
      {estado !== 'inactivo' && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`text-xs ${estado === 'error' ? 'text-terracotta-300' : 'text-sage-400'}`}
        >
          {textoPorEstado[estado]}
        </motion.span>
      )}
    </AnimatePresence>
  )
}
