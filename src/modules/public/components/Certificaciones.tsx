import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { FormaFlotante } from '../../shared/components/Decoraciones'
import { LineasFondo } from '../../shared/components/LineasFondo'
import { TituloSeccion } from '../../shared/components/TituloSeccion'
import { useCertificacionesPublicas } from '../hooks/useCertificacionesPublicas'
import { urlPreviewImagen } from '../../shared/utils/cloudinary'
import type { Certificacion } from '../../shared/types/db'

function ModalCertificacion({
  certificacion,
  onClose,
}: {
  certificacion: Certificacion | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {certificacion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/80 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-cream-50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-sage-800">{certificacion.nombre}</p>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-sage-500 transition-colors hover:bg-sage-100"
                aria-label="Cerrar"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            {certificacion.documento_url && (
              <img
                src={urlPreviewImagen(certificacion.documento_url)}
                alt={certificacion.nombre}
                className="w-full rounded-lg"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Sección clara (crema → verde muy suave) para que no rompa el
 * equilibrio de color del sitio. Tarjetas tipo credencial: vista previa
 * del documento, institución y año; "Ver credencial" abre un modal.
 * Datos reales desde /api/sitio?recurso=certificaciones, gestionados
 * desde el panel /admin/credenciales.
 */
const fondoSeccion =
  'relative overflow-hidden bg-gradient-to-b from-cream-100 via-sage-50 to-sage-100/70 px-6 py-16 md:py-20'

function Decoracion() {
  return (
    <>
      <LineasFondo variante="circulos" className="-right-28 -top-28 h-96 w-96" />
      <FormaFlotante className="-bottom-16 -left-10 h-56 w-56" color="bg-terracotta-100/50" />
    </>
  )
}

export function Certificaciones() {
  const { certificaciones, cargando } = useCertificacionesPublicas()
  const [seleccionada, setSeleccionada] = useState<Certificacion | null>(null)

  if (cargando) return null

  if (certificaciones.length === 0) {
    return (
      <section className={fondoSeccion}>
        <Decoracion />
        <div className="relative mx-auto max-w-5xl">
          <TituloSeccion>Certificaciones</TituloSeccion>
          <p className="mt-4 text-sage-700">Próximamente.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={fondoSeccion}>
      <Decoracion />
      <div className="relative mx-auto max-w-5xl">
        <TituloSeccion>Certificaciones</TituloSeccion>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {certificaciones.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="rounded-3xl border border-sage-200 bg-cream-50 p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              {c.documento_url ? (
                <img
                  src={urlPreviewImagen(c.documento_url)}
                  alt={c.nombre}
                  className="aspect-[4/3] w-full rounded-2xl bg-sage-50 object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-sage-100" />
              )}
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-sage-600">
                {c.institucion}
                {c.anio ? ` · ${c.anio}` : ''}
              </p>
              <p className="mt-1 font-serif-brand text-lg text-sage-900">{c.nombre}</p>
              {c.documento_url && (
                <button
                  onClick={() => setSeleccionada(c)}
                  className="mt-3 text-sm font-medium text-sage-700 underline decoration-terracotta-300 underline-offset-4 transition-colors hover:text-sage-900"
                >
                  Ver credencial
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <ModalCertificacion certificacion={seleccionada} onClose={() => setSeleccionada(null)} />
    </section>
  )
}
