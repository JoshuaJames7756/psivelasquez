import { Certificaciones } from '../components/Certificaciones'
import { Trayectoria } from '../components/Trayectoria'

export function FormacionPage() {
  return (
    <main>
      <div className="mx-auto max-w-3xl px-6 pt-20">
        <h1 className="font-[var(--font-serif-brand)] text-4xl text-sage-900">Formación</h1>
      </div>
      <Trayectoria />
      <Certificaciones />
    </main>
  )
}
