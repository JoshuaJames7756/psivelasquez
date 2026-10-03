import { useCertificacionesPublicas } from '../hooks/useCertificacionesPublicas'

/**
 * Única sección de contraste oscuro real del sitio (verde bosque profundo).
 * Grid estilo LinkedIn: preview del documento, institución, año, "ver credencial".
 * Datos reales desde /api/certificaciones — Rebeca las gestiona desde el
 * panel /admin/credenciales (ver CertificacionesPage).
 */
export function Certificaciones() {
  const { certificaciones, cargando } = useCertificacionesPublicas()

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
                c.documento_url.endsWith('.pdf') ? (
                  <div className="flex h-32 items-center justify-center rounded-lg bg-forest-700 text-sm text-sage-300">
                    PDF
                  </div>
                ) : (
                  <img
                    src={c.documento_url}
                    alt={c.nombre}
                    className="h-32 w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                )
              ) : (
                <div className="h-32 rounded-lg bg-forest-700" />
              )}
              <p className="mt-4 text-sm text-sage-300">
                {c.institucion}
                {c.anio ? ` · ${c.anio}` : ''}
              </p>
              <p className="font-medium">{c.nombre}</p>
              {c.documento_url && (
                <a
                  href={c.documento_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm text-terracotta-300 hover:underline"
                >
                  Ver credencial
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
