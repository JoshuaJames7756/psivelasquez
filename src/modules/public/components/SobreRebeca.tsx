import rebecaFoto from '../../../assets/fotos/rebeca-sobre-mi.jpg'

export function SobreRebeca() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div className="mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl bg-sage-100 md:mx-0">
          <img
            src={rebecaFoto}
            alt="Rebeca Velásquez"
            className="h-full w-full object-cover"
            loading="lazy"
            width={640}
            height={853}
          />
        </div>
        <div>
          <h2 className="font-[var(--font-serif-brand)] text-3xl text-sage-900">
            Sobre Rebeca
          </h2>
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
      </div>
    </section>
  )
}
