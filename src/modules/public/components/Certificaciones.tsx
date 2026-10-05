import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
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
 * Única sección de contraste oscuro real del sitio (verde bosque profundo).
 * Grid estilo LinkedIn: preview del documento, institución, año, "ver credencial"
 * abre un modal en vez de navegar a otra pestaña (sección 16 del doc: "preview; modal").
 * Datos reales desde /api/certificaciones — Rebeca las gestiona desde el
 * panel /admin/credenciales.
 */
export function Certificaciones() {
  const { certificaciones, cargando } = useCertificacionesPublicas()
  const [seleccionada, setSeleccionada] = useState<Certificacion | null>(null)

  if (cargando) return null

  if (certificaciones.length === 0) {
    return (
      <section className="bg-forest-900 px-6 py-20 text-cream-50">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-[var(--font-serif-brand)] text-3xl">Certificaciones</h2>
          <p className="mt-4 text-sage-300">Próximamente.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-forest-900 px-6 py-20 text-cream-50">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-[var(--font-serif-brand)] text-3xl">Certificaciones</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {certificaciones.map((c) => (
            <div key={c.id} className="rounded-xl border border-forest-700 bg-forest-800 p-5">
              {c.documento_url ? (
                <img
                  src={urlPreviewImagen(c.documento_url)}
                  alt={c.nombre}
                  className="h-32 w-full rounded-lg object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-32 rounded-lg bg-forest-700" />
              )}
              <p className="mt-4 text-sm text-sage-300">
                {c.institucion}
                {c.anio ? ` · ${c.anio}` : ''}
              </p>
              <p className="font-medium">{c.nombre}</p>
              {c.documento_url && (
                <button
                  onClick={() => setSeleccionada(c)}
                  className="mt-4 text-sm text-terracotta-300 transition-colors hover:text-terracotta-400"
                >
                  Ver credencial
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <ModalCertificacion certificacion={seleccionada} onClose={() => setSeleccionada(null)} />
    </section>
  )
}
