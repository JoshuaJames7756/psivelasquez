import { useReducedMotion } from 'motion/react'

/**
 * Prompt 2.0, sección 45: respetar prefers-reduced-motion. Cuando el
 * usuario lo activa, las animaciones deben reducirse o eliminarse
 * sin que la experiencia deje de ser usable — no es solo cortesía,
 * es un requisito de accesibilidad para personas con vestibular
 * disorders u otras sensibilidades al movimiento.
 *
 * Uso: const { duracion, desactivado } = useMotionSeguro()
 * - duracion(valorNormal): devuelve 0 si reduced motion está activo,
 *   el valor normal si no.
 * - desactivado: true si hay que saltear transformaciones de
 *   posición/escala/rotación por completo (tilt 3D, parallax),
 *   dejando solo fade si acaso.
 */
export function useMotionSeguro() {
  const prefiereReducido = useReducedMotion()

  return {
    desactivado: Boolean(prefiereReducido),
    duracion: (valorNormal: number) => (prefiereReducido ? 0 : valorNormal),
  }
}
