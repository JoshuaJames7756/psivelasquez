// Paleta acotada a la marca (sage + terracotta), nunca colores fuera
// de identidad. Determinístico por id: el mismo paciente siempre
// tiene el mismo color, no se recalcula al azar en cada render.
// Todos con contraste suficiente (WCAG AA) para las iniciales en crema.
const PALETA = [
  'bg-sage-600',
  'bg-sage-700',
  'bg-sage-800',
  'bg-terracotta-600',
  'bg-forest-700',
]

export function colorAvatar(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  return PALETA[Math.abs(hash) % PALETA.length]
}

export function inicialesNombre(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
