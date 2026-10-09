import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollAlTopo } from './modules/shared/components/ScrollAlTopo'
import { RequireAuth } from './modules/admin/components/RequireAuth'
import { AdminLayout } from './modules/admin/pages/AdminLayout'
import { AgendaPage } from './modules/admin/pages/AgendaPage'
import { HoyPage } from './modules/admin/pages/HoyPage'
import { ContenidoPage } from './modules/admin/pages/ContenidoPage'
import { CredencialesPage } from './modules/admin/pages/CredencialesPage'
import { FinanzasPage } from './modules/admin/pages/FinanzasPage'
import { PacientesPage } from './modules/admin/pages/PacientesPage'
import { SeguimientoPage } from './modules/admin/pages/SeguimientoPage'
import { SignInPage } from './modules/admin/pages/SignInPage'
import { TareasPage } from './modules/admin/pages/TareasPage'
import { AvisoEticoPage } from './modules/public/pages/AvisoEticoPage'
import { ComoTrabajoPage } from './modules/public/pages/ComoTrabajoPage'
import { EnfoquePage } from './modules/public/pages/EnfoquePage'
import { EnfoquesIndexPage } from './modules/public/pages/EnfoquesIndexPage'
import { FaqPage } from './modules/public/pages/FaqPage'
import { FormacionPage } from './modules/public/pages/FormacionPage'
import { HomePage } from './modules/public/pages/HomePage'
import { ModalidadPage } from './modules/public/pages/ModalidadPage'
import { PublicLayout } from './modules/public/pages/PublicLayout'
import { ReservarPage } from './modules/public/pages/ReservarPage'
import { SobreMiPage } from './modules/public/pages/SobreMiPage'

function App() {
  return (
    <BrowserRouter>
      <ScrollAlTopo />
      <Routes>
        {/* Sitio público — ecosistema de páginas (Prompt 2.0, sección 5) */}
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
        </Route>

        {/* Login — Clerk necesita rutas propias con /* para su routing interno */}
        <Route path="/sign-in/*" element={<SignInPage />} />

        {/* Panel /admin protegido — rol único (Rebeca + Joshua soporte) */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<HoyPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="seguimiento" element={<SeguimientoPage />} />
          <Route path="tareas" element={<TareasPage />} />
          <Route path="finanzas" element={<FinanzasPage />} />
          <Route path="credenciales" element={<CredencialesPage />} />
          <Route path="contenido" element={<ContenidoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
