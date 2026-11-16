import { CabeceraPagina } from '../../shared/components/CabeceraPagina'
import rebecaHero from '../../../assets/fotos/rebeca-hero.jpg'

/**
 * Texto dividido en 3 bloques (experiencia / formación / manera de
 * acompañar) sin cambiar los datos biográficos, solo reorganizando
 * el mismo contenido que ya existía para que sea más legible en
 * mobile (antes era un único párrafo largo).
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

        </div>

        <div className="relative mx-auto w-full max-w-sm md:mx-0">
          <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-sage-200/60" />
          <img
            src={rebecaHero}
            alt="Rebeca Velásquez, psicóloga clínica"
            className="relative aspect-[3/4] w-full rounded-3xl object-cover"
            width={800}
            height={1067}
          />
        </div>
      </div>
      </div>
    </main>
  )
}
