/**
 * Embed de Google Maps sin API key (modo "q=" de /maps/embed), solo
 * necesita la dirección como texto — suficiente para mostrar
 * ubicación aproximada sin costo ni configuración de backend.
 */
const DIRECCION = 'Edif. VyV NUR, Parque Fidel Anze 200, Cochabamba, Bolivia'

export function MapaUbicacion() {
  return (
    <div className="overflow-hidden rounded-2xl border border-sage-200">
      <iframe
        title="Ubicación del consultorio"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(DIRECCION)}&output=embed`}
        width="100%"
        height="280"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
