import { AnimatePresence } from 'motion/react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { NavPublica } from '../components/NavPublica'
import { TransicionPagina } from '../../shared/components/TransicionPagina'

export function PublicLayout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-cream-50">
      <NavPublica />
      <AnimatePresence mode="wait">
        <TransicionPagina key={pathname}>
          <Outlet />
        </TransicionPagina>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
