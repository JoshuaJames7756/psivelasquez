// Paleta acotada a la marca (sage + terracotta), nunca colores fuera
// de identidad. Determinístico por id: el mismo paciente siempre
// tiene el mismo color, no se recalcula al azar en cada render.
const PALETA = [
  'bg-sage-500',
  'bg-sage-700',
  'bg-terracotta-400',
  'bg-terracotta-600',
  'bg-sage-400',
  'bg-terracotta-300',
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
