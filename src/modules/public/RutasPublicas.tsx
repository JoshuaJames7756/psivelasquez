import { Route } from 'react-router-dom'
import { AvisoEticoPage } from './pages/AvisoEticoPage'
import { ComoTrabajoPage } from './pages/ComoTrabajoPage'
import { EnfoquePage } from './pages/EnfoquePage'
import { EnfoquesIndexPage } from './pages/EnfoquesIndexPage'
import { FaqPage } from './pages/FaqPage'
import { FormacionPage } from './pages/FormacionPage'
import { HomePage } from './pages/HomePage'
import { ModalidadPage } from './pages/ModalidadPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PublicLayout } from './pages/PublicLayout'
import { ReservarPage } from './pages/ReservarPage'
import { SobreMiPage } from './pages/SobreMiPage'

/**
 * Árbol de rutas públicas. Se llama como función (no como componente)
 * porque <Routes> solo acepta <Route> directos. Lo usan App.tsx (navegador)
 * y entry-server.tsx (prerender del build).
 */
export function rutasPublicas() {
  return (
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/sobre-mi" element={<SobreMiPage />} />
      <Route path="/como-trabajo" element={<ComoTrabajoPage />} />
      <Route path="/enfoques" element={<EnfoquesIndexPage />} />
      <Route path="/enfoques/:slug" element={<EnfoquePage />} />
      <Route path="/formacion" element={<FormacionPage />} />
      <Route path="/modalidad" element={<ModalidadPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/reservar" element={<ReservarPage />} />
      <Route path="/aviso-etico" element={<AvisoEticoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
}
