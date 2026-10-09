import type {
  DocumentoPaciente,
  EscalaSeguimiento,
  HistorialClinico,
  Paciente,
} from '../../shared/types/db'

export interface FichaExportable {
  paciente: Paciente
  historial: HistorialClinico[]
  escalas: EscalaSeguimiento[]
  documentos: DocumentoPaciente[]
}

const esc = (t: string | number | null | undefined) =>
  String(t ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' })

const parrafos = (t: string | null) =>
  t && t.trim() ? esc(t).replace(/\n/g, '<br>') : '<span class="vacio">Sin registro</span>'

/**
 * Exporta la ficha (o una sola nota) a PDF usando el diálogo de
 * impresión del navegador: "Guardar como PDF". No agrega dependencias,
 * no envía datos clínicos a ningún servicio y respeta tildes y eñes.
 * Todo el texto se escapa antes de armar el HTML.
 */
export function exportarFicha(ficha: FichaExportable, soloNotaId?: string): boolean {
  const { paciente, historial, escalas, documentos } = ficha
  const notas = soloNotaId ? historial.filter((h) => h.id === soloNotaId) : historial

  const notasHtml = notas.length
    ? notas
        .map(
          (n) => `
      <section class="nota">
        <h3>Sesión del ${esc(fecha(n.creado_en))}</h3>
        <h4>Motivo</h4><p>${parrafos(n.motivo)}</p>
        <h4>Intervención</h4><p>${parrafos(n.intervencion)}</p>
        <h4>Tareas / homework</h4><p>${parrafos(n.tareas_homework)}</p>
        <h4>Próximos pasos</h4><p>${parrafos(n.proximos_pasos)}</p>
      </section>`,
        )
        .join('')
    : '<p class="vacio">Sin notas de sesión.</p>'

  const escalasHtml =
    !soloNotaId && escalas.length
      ? `<h2>Escalas de seguimiento</h2>
         <table><thead><tr><th>Fecha</th><th>Escala</th><th>Puntaje</th></tr></thead><tbody>
         ${escalas
           .map((e) => `<tr><td>${esc(fecha(e.aplicada_en))}</td><td>${esc(e.tipo)}</td><td>${esc(e.puntaje)}</td></tr>`)
           .join('')}
         </tbody></table>`
      : ''

  const docsHtml =
    !soloNotaId && documentos.length
      ? `<h2>Documentos adjuntos</h2><ul>${documentos
          .map((d) => `<li>${esc(d.nombre)} (${esc(fecha(d.subido_en))})</li>`)
          .join('')}</ul>`
      : ''

  const titulo = `Ficha ${paciente.nombre}`
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>${esc(titulo)}</title>
<style>
  body{font-family:Georgia,'Times New Roman',serif;color:#2b3a27;margin:32px;line-height:1.5}
  header{border-bottom:2px solid #64855a;padding-bottom:12px;margin-bottom:20px}
  h1{font-size:24px;margin:0} h2{font-size:18px;margin:28px 0 8px;color:#3e5638}
  h3{font-size:15px;margin:0 0 6px} h4{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#64855a;margin:10px 0 2px}
  p{margin:0;font-size:13px} .meta{font-size:12px;color:#4d6b45;margin-top:4px}
  .nota{border:1px solid #c7d7c1;border-radius:8px;padding:12px 14px;margin-bottom:12px;break-inside:avoid}
  .vacio{color:#82a175;font-style:italic} table{border-collapse:collapse;width:100%;font-size:12px}
  th,td{border-bottom:1px solid #e3ebe0;padding:6px 8px;text-align:left} li{font-size:13px}
  footer{margin-top:32px;font-size:11px;color:#82a175;border-top:1px solid #e3ebe0;padding-top:8px}
  @media print{body{margin:16mm}}
</style></head><body>
<header>
  <h1>${esc(paciente.nombre)}</h1>
  <p class="meta">${paciente.edad ? esc(paciente.edad) + ' años · ' : ''}Estado: ${esc(paciente.estado)}${paciente.telefono ? ' · Tel. ' + esc(paciente.telefono) : ''}</p>
  ${paciente.motivo_inicial ? `<p class="meta">Motivo inicial: ${esc(paciente.motivo_inicial)}</p>` : ''}
</header>
<h2>${soloNotaId ? 'Nota de sesión' : 'Notas de sesión'}</h2>
${notasHtml}${escalasHtml}${docsHtml}
<footer>Documento confidencial. Rebeca Velásquez, Psicóloga Clínica. Generado el ${esc(fecha(new Date().toISOString()))}.</footer>
</body></html>`

  const ventana = window.open('', '_blank')
  if (!ventana) return false
  ventana.document.open()
  ventana.document.write(html)
  ventana.document.close()
  ventana.focus()
  // Pequeña espera para que el navegador termine de pintar antes de imprimir.
  setTimeout(() => ventana.print(), 300)
  return true
}
