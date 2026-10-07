import { Link } from 'react-router-dom'
import { ScrollReveal } from '../../shared/components/ScrollReveal'
import { ComoSeSienteEsteEspacio } from '../components/ComoSeSienteEsteEspacio'
import { EnfoqueTerapeutico } from '../components/EnfoqueTerapeutico'
import { Hero } from '../components/Hero'
import { ParaQuienEs } from '../components/ParaQuienEs'
import { PrimeraSesion } from '../components/PrimeraSesion'
import { SobreRebeca } from '../components/SobreRebeca'

/**
 * Recorrido de la Home (pedido explícito): quién es Rebeca → a quién
 * acompaña → cómo se siente trabajar con ella → cómo empezar.
 * Formación, FAQ y contenido extenso viven en sus propias páginas —
 * acá solo un CTA hacia Formación al final, sin repetir "reservar"
 * una tercera vez (ya está en el Hero y en Primera sesión / vía
 * Certificaciones no aplica — el único otro CTA de reservar directo
 * quedó en Hero; se quitó el bloque final duplicado "¿lista para dar
 * el primer paso?" que repetía el mismo mensaje).
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
        <section className="con-grain mx-auto max-w-3xl px-6 py-14 text-center md:py-16">
          <h2 className="font-[var(--font-serif-brand)] text-2xl text-sage-900">
            Una trayectoria construida con intención
          </h2>
          <p className="mt-3 text-sage-700">
            Formación clínica sólida, desde la Universidad Católica Boliviana hasta el Hospital
            Israelita Albert Einstein.
          </p>
          <Link
            to="/formacion"
            className="mt-5 inline-block rounded-full border border-sage-400 px-6 py-2 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-100"
          >
            Conocer mi formación
          </Link>
        </section>
      </ScrollReveal>
    </main>
  )
}
