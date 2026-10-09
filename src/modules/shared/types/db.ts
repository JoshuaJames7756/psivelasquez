/**
 * Tipos que reflejan el esquema de db/migrations/001_init.sql +
 * 006_estados_cita_ampliados.sql. Fuente de verdad única para /api y
 * para el panel /admin. Si el SQL cambia, este archivo se actualiza
 * en el mismo commit.
 */

export type EstadoCita =
  | 'disponible'
  | 'solicitada'
  | 'confirmada'
  | 'pagada'
  | 'completada'
  | 'cancelada'
  | 'liberada'
  | 'vencida'
export type ModalidadCita = 'presencial' | 'online'
export type EstadoPaciente = 'activo' | 'pausado' | 'alta'
export type TipoEscala = 'GAD-7' | 'PHQ-9'

export interface Paciente {
  id: string
  nombre: string
  edad: number | null
  telefono: string | null
  motivo_inicial: string | null
  primera_vez: boolean
  estado: EstadoPaciente
  creado_en: string
  actualizado_en: string
}

export interface SlotSabado {
  id: string
  fecha: string // ISO date
  hora_inicio: string // "HH:MM"
  modalidad: ModalidadCita | null
  estado: EstadoCita
  paciente_id: string | null
  solicitado_en: string | null
  expira_en: string | null
  confirmado_en: string | null
  notas_reserva: string | null
  creado_en: string
  actualizado_en: string
}

/**
 * Slot con datos de paciente hidratados — solo lo devuelve
 * GET /api/citas/panel (protegido), nunca el endpoint público.
 */
export interface SlotSabadoPanel {
  id: string
  fecha: string
  hora_inicio: string
  modalidad: ModalidadCita | null
  estado: EstadoCita
  paciente_id: string | null
  paciente_nombre: string | null
  paciente_telefono: string | null
}

export interface TagClinico {
  id: string
  nombre: string
  color: string | null
}

export interface HistorialClinico {
  id: string
  paciente_id: string
  slot_id: string | null
  motivo: string | null
  intervencion: string | null
  tareas_homework: string | null
  proximos_pasos: string | null
  creado_en: string
  actualizado_en: string
  tags?: TagClinico[] // hidratado vía join, no columna real
}

export interface DocumentoPaciente {
  id: string
  paciente_id: string
  url: string
  nombre: string
  tipo: string | null
  subido_en: string
}

export type EstadoTarea = 'todo' | 'en_progreso' | 'hecha' | 'cancelada'
export type PrioridadTarea = 'baja' | 'media' | 'alta'

export interface Tarea {
  id: string
  titulo: string
  descripcion: string | null
  prioridad: PrioridadTarea
  fecha_limite: string | null
  estado: EstadoTarea
  paciente_id: string | null
  creado_en: string
  actualizado_en: string
}

export interface Certificacion {
  id: string
  institucion: string
  nombre: string
  anio: number | null
  categoria: string | null
  descripcion: string | null
  documento_url: string | null
  orden: number
  creado_en: string
}

export interface EscalaSeguimiento {
  id: string
  paciente_id: string
  tipo: TipoEscala
  puntaje: number
  aplicada_en: string
  creado_en: string
}

export interface PublicacionRed {
  id: string
  plataforma: 'instagram' | 'tiktok'
  url: string
  titulo: string | null
  miniatura_url: string | null
  visible: boolean
  orden: number
  creado_en: string
}
