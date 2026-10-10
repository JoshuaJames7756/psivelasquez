import { Link } from 'react-router-dom'
import { CabeceraPagina } from '../../shared/components/CabeceraPagina'

export function NotFoundPage() {
  return (
    <main>
      <CabeceraPagina
        etiqueta="Error 404"
        titulo="No encontramos esta página"
        intro="Puede que el enlace esté mal escrito o que la página ya no exista."
        estilo="puntos"
        tono="crema"
      />
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-4">
        <Link to="/" className="inline-block rounded-full bg-sage-700 px-6 py-2.5 text-sm font-medium text-cream-50 hover:bg-sage-800">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
