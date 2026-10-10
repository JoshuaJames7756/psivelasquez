import { CabeceraPagina } from '../../shared/components/CabeceraPagina'

/**
 * PLACEHOLDER DE CONTENIDO — el doc (sección 13) pide desarrollar acá:
 * enfoque, colaboración, evaluación, objetivos, seguimiento, adaptación
 * del proceso. Esto es metodología clínica real de Rebeca, no algo que
 * corresponda inventar — necesita que ella lo describa con sus propias
 * palabras antes de publicar.
 */
export function ComoTrabajoPage() {
  return (
    <main>
      <CabeceraPagina etiqueta="Metodología" titulo="Cómo trabajo" estilo="rama" tono="sage" />
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-6">
        <p className="text-lg text-sage-500">
          Contenido pendiente — necesita que Rebeca describa su metodología (enfoque,
          colaboración, evaluación, objetivos, seguimiento y adaptación del proceso) antes de
          publicar.
        </p>
      </div>
    </main>
  )
}
