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
import { rutasPublicas } from './modules/public/RutasPublicas'
import { SignInPage } from './modules/admin/pages/SignInPage'
import { TareasPage } from './modules/admin/pages/TareasPage'

function App() {
  return (
    <BrowserRouter>
      <ScrollAlTopo />
      <Routes>
        {/* Sitio público — ecosistema de páginas (Prompt 2.0, sección 5) */}
        {rutasPublicas()}

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
