import { CabeceraPagina } from '../../shared/components/CabeceraPagina'
import { Faq } from '../components/Faq'

export function FaqPage() {
  return (
    <main>
      <CabeceraPagina
        etiqueta="Antes de escribirme"
        titulo="Preguntas frecuentes"
        estilo="circulos"
        tono="crema"
      />
      <Faq conTitulo={false} />
    </main>
  )
}
