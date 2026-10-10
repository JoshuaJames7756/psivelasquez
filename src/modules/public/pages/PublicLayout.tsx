import { AnimatePresence } from 'motion/react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { NavPublica } from '../components/NavPublica'
import { buscarSeo, seo404 } from '../../shared/seo/sitio'
import { useSeo } from '../../shared/seo/useSeo'
import { TransicionPagina } from '../../shared/components/TransicionPagina'

export function PublicLayout() {
  const { pathname } = useLocation()
  useSeo(buscarSeo(pathname) ?? { ...seo404, ruta: pathname })

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
