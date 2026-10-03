import { Link } from 'react-router-dom'
import { ScrollReveal } from '../../shared/components/ScrollReveal'
import { ComoSeSienteEsteEspacio } from '../components/ComoSeSienteEsteEspacio'
import { EnfoqueTerapeutico } from '../components/EnfoqueTerapeutico'
import { Hero } from '../components/Hero'
import { ParaQuienEs } from '../components/ParaQuienEs'
import { PrimeraSesion } from '../components/PrimeraSesion'
import { SobreRebeca } from '../components/SobreRebeca'

/**
 * La Home introduce y dirige, no explica todo (Prompt 2.0, sección 4
 * y 12). Formación, Certificaciones, Modalidad y FAQ completos viven
 * en sus propias páginas — acá solo un resumen breve con CTA hacia
 * cada una, evitando duplicar el contenido completo dos veces.
 */
export function HomePage() {
  return (
    <main>
      <Hero />
      <ScrollReveal>
        <SobreRebeca />
      </ScrollReveal>
      <EnfoqueTerapeutico />
      {/* Video corto y curado de Rebeca — pendiente de asset real */}
      <ScrollReveal>
        <ParaQuienEs />
      </ScrollReveal>
      <ScrollReveal>
        <PrimeraSesion />
      </ScrollReveal>
      <ScrollReveal>
        <ComoSeSienteEsteEspacio />
      </ScrollReveal>

      <ScrollReveal>
        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="font-[var(--font-serif-brand)] text-2xl text-sage-900">
            Una trayectoria construida con intención
          </h2>
          <p className="mt-3 text-sage-700">
            Formación clínica sólida, desde la Universidad Católica Boliviana hasta el Hospital
            Israelita Albert Einstein.
          </p>
          <Link
            to="/formacion"
            className="mt-5 inline-block rounded-full border border-sage-400 px-6 py-2 text-sm font-medium text-sage-700 hover:bg-sage-100"
          >
            Conocer mi formación
          </Link>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-sage-50 px-6 py-16 text-center">
          <h2 className="font-[var(--font-serif-brand)] text-2xl text-sage-900">
            ¿Lista para dar el primer paso?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sage-700">
            Atiendo un solo día a la semana, presencial u online, para darle a cada sesión la
            atención que merece.
          </p>
          <Link
            to="/reservar"
            className="mt-5 inline-block rounded-full bg-sage-700 px-6 py-2 text-sm font-medium text-cream-50 hover:bg-sage-800"
          >
            Ver cupos disponibles
          </Link>
        </section>
      </ScrollReveal>
    </main>
  )
}
