import rebecaFoto from '../../../assets/fotos/rebeca-hero.jpg'

/**
 * Contenido base movido desde el bloque "Sobre Rebeca" de la Home.
 * El doc (sección 13) pide profundizar en trayectoria, filosofía
 * profesional, formación y experiencia — hoy esta página tiene el
 * mismo texto que ya existía, sin ampliar todavía. La Trayectoria
 * (línea de tiempo) se movió aparte a /formacion.
 */
export function SobreMiPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid items-start gap-10 md:grid-cols-[1fr_0.8fr]">
        <div>
          <h1 className="font-[var(--font-serif-brand)] text-4xl text-sage-900">Sobre mí</h1>
          <p className="mt-6 text-lg leading-relaxed text-sage-800">
            Soy psicóloga clínica con enfoque Cognitivo-Conductual. Trabajo actualmente en el
            Hospital Belga y me formé en Psicología Hospitalaria en el Hospital Israelita Albert
            Einstein de São Paulo, uno de los centros de salud más reconocidos de Latinoamérica.
            Mi mirada no se queda solo en el síntoma: estudié Marriage and Family Studies en
            BYU-Idaho porque creo que entender tus vínculos es parte de entenderte a ti.
            Acompaño a adolescentes y adultos que atraviesan ansiedad, procesos de salud
            difíciles, y momentos de cambio, siempre con base ética, evidencia clínica real, y
            un espacio donde puedas ser honesto sin miedo.
          </p>
        </div>
        <div className="mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl bg-sage-100 md:mx-0">
          <img
            src={rebecaFoto}
            alt="Rebeca Velásquez, psicóloga clínica"
            className="h-full w-full object-cover"
            width={800}
            height={1067}
          />
        </div>
      </div>
    </main>
  )
}
