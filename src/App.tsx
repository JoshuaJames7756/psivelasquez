import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollAlTopo } from './modules/shared/components/ScrollAlTopo'
import { RequireAuth } from './modules/admin/components/RequireAuth'
import { PantallaCarga } from './modules/shared/components/PantallaCarga'
import { rutasPublicas } from './modules/public/RutasPublicas'
import { SignInPage } from './modules/admin/pages/SignInPage'

// El panel se descarga aparte: quien solo visita el sitio público no baja su código.
const pagina = <T extends Record<string, React.ComponentType>>(cargar: () => Promise<T>, nombre: keyof T) =>
  lazy(() => cargar().then((m) => ({ default: m[nombre] })))

const AdminLayout = pagina(() => import('./modules/admin/pages/AdminLayout'), 'AdminLayout')
const HoyPage = pagina(() => import('./modules/admin/pages/HoyPage'), 'HoyPage')
const AgendaPage = pagina(() => import('./modules/admin/pages/AgendaPage'), 'AgendaPage')
const PacientesPage = pagina(() => import('./modules/admin/pages/PacientesPage'), 'PacientesPage')
const SeguimientoPage = pagina(() => import('./modules/admin/pages/SeguimientoPage'), 'SeguimientoPage')
const TareasPage = pagina(() => import('./modules/admin/pages/TareasPage'), 'TareasPage')
const FinanzasPage = pagina(() => import('./modules/admin/pages/FinanzasPage'), 'FinanzasPage')
const CredencialesPage = pagina(() => import('./modules/admin/pages/CredencialesPage'), 'CredencialesPage')
const ContenidoPage = pagina(() => import('./modules/admin/pages/ContenidoPage'), 'ContenidoPage')

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
              <Suspense fallback={<PantallaCarga />}>
                <AdminLayout />
              </Suspense>
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
