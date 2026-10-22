import { LineasFondo } from '../../shared/components/LineasFondo'
import { TituloSeccion } from '../../shared/components/TituloSeccion'
const cualidades = ['Escucha', 'Estructura', 'Respeto', 'Colaboración', 'Privacidad']

/**
 * Prompt 2.0, sección 12: "¿Cómo se siente tener una sesión aquí?
 * No solamente ¿Qué títulos tiene Rebeca?"
 *
 * El placeholder de foto de consultorio queda marcado explícitamente
 * como tal (borde punteado + texto), no como una imagen gris
 * genérica — para que sea obvio en el código y visualmente que acá
 * falta un asset real, no que el diseño esté "terminado" así.
 */
export function ComoSeSienteEsteEspacio() {
  return (
    <section className="con-grain relative overflow-hidden bg-cream-100 px-6 py-16 md:py-20">
      {/* Acentos de fondo: absolutos y fuera del flujo (no generan espacio). */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sage-200/40 blur-3xl" />
      <LineasFondo variante="ondas" className="inset-x-0 bottom-0 h-36 w-full" />
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        {/* Composición editorial mientras no exista una foto real del consultorio
            (Prompt 2.0, sección 10: nada de fotos stock). Para poner la foto,
            reemplazar este div por un <img> con la misma proporción 4/3. */}
        <div className="relative order-2 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-sage-100 md:order-1">
          <LineasFondo variante="hojas" className="-bottom-8 -left-8 h-3/4 w-3/4 text-sage-300" />
          <LineasFondo variante="ondas" className="inset-x-0 top-0 h-1/3 w-full text-sage-200" />
          <p className="font-serif-brand relative px-8 text-center text-3xl leading-snug text-sage-800 md:text-4xl">
            Sin apuro,
            <br />
            sin juicio.
          </p>
        </div>

        <div className="order-1 md:order-2">
          <TituloSeccion>Cómo se siente este espacio</TituloSeccion>
          <p className="mt-5 text-sage-700">
            Más allá de la formación y las credenciales, lo que importa es cómo te sientes
            cuando llegas. Un espacio donde no hay apuro, ni juicio, ni respuestas que debas
            tener preparadas de antemano.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
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

