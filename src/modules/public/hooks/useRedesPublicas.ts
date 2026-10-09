import { useEffect, useState } from 'react'
import type { PublicacionRed } from '../../shared/types/db'

export function useRedesPublicas() {
  const [publicaciones, setPublicaciones] = useState<PublicacionRed[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch('/api/sitio?recurso=redes')
      .then((r) => (r.ok ? r.json() : { publicaciones: [] }))
      .then((d) => setPublicaciones(d.publicaciones ?? []))
      .catch(() => setPublicaciones([]))
      .finally(() => setCargando(false))
  }, [])

  return { publicaciones, cargando }
}
