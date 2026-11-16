import { LineasFondo } from '../../shared/components/LineasFondo'
import { TituloSeccion } from '../../shared/components/TituloSeccion'
const cualidades = ['Escucha', 'Estructura', 'Respeto', 'Colaboración', 'Privacidad']

/** Sección de texto, sin foto: transmite cómo se siente la sesión. */
export function ComoSeSienteEsteEspacio() {
  return (
    <section className="con-grain relative overflow-hidden bg-cream-100 px-6 py-16 md:py-20">
      {/* Acentos de fondo: absolutos y fuera del flujo (no generan espacio). */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sage-200/40 blur-3xl" />
      <LineasFondo variante="ondas" className="inset-x-0 bottom-0 h-36 w-full" />
      <div className="relative mx-auto max-w-3xl text-center">
        <div>
          <TituloSeccion centrado>Cómo se siente este espacio</TituloSeccion>
          <p className="mt-5 text-sage-700">
            Más allá de la formación y las credenciales, lo que importa es cómo te sientes
            cuando llegas. Un espacio donde no hay apuro, ni juicio, ni respuestas que debas
            tener preparadas de antemano.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {cualidades.map((c) => (
              <li
                key={c}
                className="rounded-full border border-sage-300 px-4 py-1.5 text-sm text-sage-700"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

