import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './modules/admin/components/RequireAuth'
import { AdminLayout } from './modules/admin/pages/AdminLayout'
import { AgendaPage } from './modules/admin/pages/AgendaPage'
import { HoyPage } from './modules/admin/pages/HoyPage'
import { PacientesPage } from './modules/admin/pages/PacientesPage'
import { SignInPage } from './modules/admin/pages/SignInPage'
import { HomePage } from './modules/public/pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Sitio público */}
        <Route path="/" element={<HomePage />} />

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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
