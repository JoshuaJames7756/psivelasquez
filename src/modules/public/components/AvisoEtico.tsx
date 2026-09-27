/**
 * Contenido clínico ya validado según el doc — pendiente de que Rebeca
 * confirme el texto exacto en primera persona antes de publicar.
 * Placeholder estructural con los puntos obligatorios: fines informativos,
 * no sustituye atención profesional, confidencialidad, evaluación previa.
 */
export function AvisoEtico() {
  return (
    <section className="bg-sage-50 px-6 py-16">
      <div className="mx-auto max-w-3xl text-sm leading-relaxed text-sage-700">
        <h2 className="mb-3 text-base font-semibold text-sage-800">Aviso ético</h2>
        <p>
          La información de este sitio tiene fines informativos y no sustituye una atención
          psicológica profesional. Todo proceso terapéutico requiere una evaluación previa.
          Manejo la confidencialidad de cada caso conforme a mi código de ética profesional.
        </p>
      </div>
    </section>
  )
}
