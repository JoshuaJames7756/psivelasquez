import { colorAvatar, inicialesNombre } from '../../shared/utils/avatarColor'
import { useFichaPaciente } from '../hooks/useFichaPaciente'
import { GraficoEscalas } from './GraficoEscalas'
import { HistorialClinicoForm } from './HistorialClinicoForm'

export function FichaPacientePanel({ pacienteId }: { pacienteId: string | null }) {
  const { ficha, cargando } = useFichaPaciente(pacienteId)

  if (!pacienteId) {
    return (
      <div className="flex h-full items-center justify-center text-sage-400">
        Selecciona un paciente para ver su ficha
      </div>
    )
  }

  if (cargando || !ficha) {
    return <div className="p-8 text-sage-400">Cargando ficha...</div>
  }

  const { paciente, historial, escalas, documentos } = ficha
  const notaMasReciente = historial[0]

  return (
    <div className="h-full overflow-y-auto bg-cream-50 p-6 md:p-8">
      <div className="flex items-center gap-4">
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-cream-50 ${colorAvatar(paciente.id)}`}
        >
          {inicialesNombre(paciente.nombre)}
        </span>
        <div>
          <h2 className="text-xl font-semibold text-sage-900">{paciente.nombre}</h2>
          <p className="text-sm text-sage-600">
            {paciente.edad ? `${paciente.edad} años · ` : ''}
            {paciente.estado === 'activo'
              ? 'Activo'
              : paciente.estado === 'pausado'
                ? 'Pausado'
                : 'De alta'}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {notaMasReciente ? (
            <HistorialClinicoForm registro={notaMasReciente} />
          ) : (
            <p className="text-sm text-sage-500">
              Este paciente todavía no tiene notas de sesión.
            </p>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-sage-800">Escalas de seguimiento</h3>
            <GraficoEscalas escalas={escalas} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-sage-800">Documentos</h3>
            {documentos.length === 0 ? (
              <p className="text-sm text-sage-500">Sin documentos adjuntos.</p>
            ) : (
              <ul className="space-y-2">
                {documentos.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-sage-700 underline hover:text-sage-900"
                    >
                      {doc.nombre}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
