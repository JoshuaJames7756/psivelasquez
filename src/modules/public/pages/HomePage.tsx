import { ScrollReveal } from '../../shared/components/ScrollReveal'
import { AvisoEtico } from '../components/AvisoEtico'
import { Certificaciones } from '../components/Certificaciones'
import { EnfoqueTerapeutico } from '../components/EnfoqueTerapeutico'
import { Faq } from '../components/Faq'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { ModalidadAgenda } from '../components/ModalidadAgenda'
import { ParaQuienEs } from '../components/ParaQuienEs'
import { PrimeraSesion } from '../components/PrimeraSesion'
import { SobreRebeca } from '../components/SobreRebeca'
import { Trayectoria } from '../components/Trayectoria'

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
      <Trayectoria />
      <Certificaciones />
      <ScrollReveal>
        <ModalidadAgenda />
      </ScrollReveal>
      <Faq />
      <AvisoEtico />
      <Footer />
    </main>
  )
}
