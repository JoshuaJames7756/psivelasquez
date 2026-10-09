import type { EstadoCita } from '../../../shared/types/db'

export const etiquetaEstado: Record<EstadoCita, string> = {
  disponible: 'Libre',
  solicitada: 'Por confirmar',
  confirmada: 'Confirmada',
  pagada: 'Pagada',
  completada: 'Completada',
  cancelada: 'Cancelada',
  liberada: 'Libre',
  vencida: 'Vencida',
}

export const chipEstado: Record<EstadoCita, string> = {
  disponible: 'bg-sage-100 text-sage-700',
  solicitada: 'bg-terracotta-100 text-terracotta-600',
  confirmada: 'bg-sage-200 text-sage-800',
  pagada: 'bg-sage-600 text-cream-50',
  completada: 'bg-cream-300 text-sage-800',
  cancelada: 'bg-cream-200 text-sage-500',
  liberada: 'bg-sage-100 text-sage-700',
  vencida: 'bg-cream-200 text-sage-500',
}

const ACTIVOS: EstadoCita[] = ['solicitada', 'confirmada', 'pagada', 'completada']
export const esActivo = (e: EstadoCita) => ACTIVOS.includes(e)
