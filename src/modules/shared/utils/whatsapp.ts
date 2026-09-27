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
