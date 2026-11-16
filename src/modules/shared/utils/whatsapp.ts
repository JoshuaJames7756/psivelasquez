/**
 * Construye un link wa.me a partir de un teléfono en formato libre
 * (tal como lo escribió el paciente en el formulario de reserva).
 * Solo deja dígitos; wa.me no acepta espacios, +, ni guiones.
 */
export function linkWhatsApp(telefono: string, mensaje?: string) {
  const soloDigitos = telefono.replace(/\D/g, '')
  const base = `https://wa.me/${soloDigitos}`
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base
}

export interface DatosReserva {
  nombre: string
  edad?: string
  modalidad: 'presencial' | 'online'
  horario: 'cualquiera' | 'manana' | 'tarde'
  primeraVez: boolean
  motivo?: string
}

const TEXTO_HORARIO: Record<DatosReserva['horario'], string> = {
  cualquiera: 'cualquier horario',
  manana: 'por la mañana',
  tarde: 'por la tarde',
}

/**
 * Mensaje prellenado para pedir una sesión. Solo incluye lo que la persona
 * escribió; el motivo es opcional y se recorta para no llevar detalles
 * clínicos por el enlace.
 */
export function construirMensajeReserva(d: DatosReserva): string {
  const lineas = [
    'Hola Rebeca, quisiera solicitar una sesión.',
    '',
    `Nombre: ${d.nombre.trim()}`,
  ]
  const edad = d.edad?.trim()
  if (edad) lineas.push(`Edad: ${edad}`)
  lineas.push(`Modalidad: ${d.modalidad}`)
  lineas.push(`Horario preferido: ${TEXTO_HORARIO[d.horario]}`)
  lineas.push(`Primera vez en terapia: ${d.primeraVez ? 'sí' : 'no'}`)
  const motivo = d.motivo?.trim().slice(0, 300)
  if (motivo) lineas.push(`Motivo breve: ${motivo}`)
  return lineas.join('\n')
}
