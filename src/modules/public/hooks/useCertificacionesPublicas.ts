import { useEffect, useState } from 'react'
import type { Certificacion } from '../../shared/types/db'

export function useCertificacionesPublicas() {
  const [certificaciones, setCertificaciones] = useState<Certificacion[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch('/api/certificaciones')
      .then((r) => r.json())
      .then((data) => setCertificaciones(data.certificaciones ?? []))
      .catch(() => setCertificaciones([]))
      .finally(() => setCargando(false))
  }, [])

  return { certificaciones, cargando }
}
