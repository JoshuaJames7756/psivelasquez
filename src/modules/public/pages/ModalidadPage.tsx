import { MapaUbicacion } from '../components/MapaUbicacion'

export function ModalidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-serif-brand text-4xl text-sage-900">Modalidad</h1>
      <p className="mt-4 text-sage-700">
        Atiendo un solo día a la semana para poder darle a cada sesión la atención que merece.
        Puedes elegir la modalidad que prefieras al reservar.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-sage-200 bg-sage-50 p-5">
          <h2 className="text-sm font-semibold text-sage-800">Presencial</h2>
          <p className="mt-2 text-sm text-sage-700">
            Edif. VyV NUR
            <br />
            Parque Fidel Anze #200, Esq. Av. Pando
            <br />
            Cochabamba
          </p>
        </div>
        <div className="rounded-xl border border-sage-200 bg-sage-50 p-5">
          <h2 className="text-sm font-semibold text-sage-800">Online</h2>
          <p className="mt-2 text-sm text-sage-700">
            Videollamada, el enlace se coordina por WhatsApp antes de tu sesión.
          </p>
        </div>
        <div className="rounded-xl border border-sage-200 bg-sage-50 p-5 sm:col-span-2">
          <h2 className="text-sm font-semibold text-sage-800">Horario</h2>
          <p className="mt-2 text-sm text-sage-700">Sábados, 09:00 a 17:00</p>
        </div>
      </div>

      <div className="mt-6">
        <MapaUbicacion />
      </div>
    </main>
  )
}
