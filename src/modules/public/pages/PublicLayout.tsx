import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { NavPublica } from '../components/NavPublica'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-cream-50">
      <NavPublica />
      <Outlet />
      <Footer />
    </div>
  )
}
