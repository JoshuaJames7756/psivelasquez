import { Link } from 'react-router-dom'
import rebecaFoto from '../../../assets/fotos/rebeca-sobre-mi.jpg'

export function SobreRebeca() {
  return (
    <section className="con-grain mx-auto max-w-5xl px-6 py-16 md:py-20">
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
            Soy psicóloga clínica con enfoque Cognitivo-Conductual. Acompaño a adolescentes y
            adultos que atraviesan ansiedad, procesos de salud difíciles, y momentos de cambio,
            siempre con base ética y un espacio donde puedas ser honesto sin miedo.
          </p>
          <Link
            to="/sobre-mi"
            className="mt-5 inline-block text-sm font-medium text-sage-600 transition-colors hover:text-sage-800"
          >
            Conocer más sobre mí →
          </Link>
        </div>
      </div>
    </section>
  )
}
