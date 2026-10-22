import { Link } from 'react-router-dom'
import { CabeceraPagina } from '../../shared/components/CabeceraPagina'
import { LineasFondo } from '../../shared/components/LineasFondo'

/**
 * Texto dividido en 3 bloques (experiencia / formación / manera de
 * acompañar) sin cambiar los datos biográficos, solo reorganizando
 * el mismo contenido que ya existía para que sea más legible en
 * mobile (antes era un único párrafo largo).
 *
 * Foto: placeholder marcado a propósito — usar el mismo retrato que
 * el Hero (aunque con otro recorte) seguiría siendo la misma foto
 * repetida. Pendiente de una foto realmente distinta de Rebeca.
 */
export function SobreMiPage() {
  return (
    <main>
      <CabeceraPagina etiqueta="Rebeca Velásquez" titulo="Sobre mí" estilo="hojas" tono="terracota" ancho="max-w-5xl" />
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-6">
      <div className="grid items-start gap-10 md:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="text-lg leading-relaxed text-sage-800">
            Soy psicóloga clínica con enfoque Cognitivo-Conductual. Acompaño a adolescentes y
            adultos que atraviesan ansiedad, procesos de salud difíciles, y momentos de cambio.
          </p>

          <p className="mt-5 text-base leading-relaxed text-sage-700">
            Trabajo actualmente en el Hospital Belga y me formé en Psicología Hospitalaria en el
            Hospital Israelita Albert Einstein de São Paulo, uno de los centros de salud más
            reconocidos de Latinoamérica.
          </p>

          <p className="mt-5 text-base leading-relaxed text-sage-700">
            Mi mirada no se queda solo en el síntoma: estudié Marriage and Family Studies en
            BYU-Idaho porque creo que entender tus vínculos es parte de entenderte a ti. Trabajo
            siempre con base ética, evidencia clínica real, y un espacio donde puedas ser
            honesto sin miedo.
          </p>

          <Link
            to="/como-trabajo"
            className="mt-8 inline-block rounded-full border border-sage-400 px-6 py-2.5 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-100"
          >
            Conocer cómo trabajo →
          </Link>
        </div>

        {/* Composición editorial hasta tener una segunda foto real de Rebeca.
            Para ponerla, reemplazar este div por un <img> con proporción 3/4. */}
        <div className="relative mx-auto flex aspect-[3/4] w-full max-w-sm items-center justify-center overflow-hidden rounded-3xl bg-sage-100 md:mx-0">
          <LineasFondo variante="rama" className="-bottom-6 -right-8 h-4/5 w-3/5 text-sage-300" />
          <LineasFondo variante="contorno" className="-left-10 -top-6 h-3/5 w-3/5 text-sage-200" />
          <span aria-hidden="true" className="font-serif-brand relative text-7xl text-sage-700">RV</span>
        </div>
      </div>
      </div>
    </main>
  )
}
