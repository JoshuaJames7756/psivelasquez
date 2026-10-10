import { CabeceraPagina } from '../../shared/components/CabeceraPagina'
import { Certificaciones } from '../components/Certificaciones'
import { Trayectoria } from '../components/Trayectoria'

export function FormacionPage() {
  return (
    <main>
      <CabeceraPagina etiqueta="Estudios y certificaciones" titulo="Formación" estilo="hojas" tono="crema" />
      <Trayectoria />
      <Certificaciones />
    </main>
  )
}
