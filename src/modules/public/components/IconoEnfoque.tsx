/** Iconos de línea simples por área. Decorativos (aria-hidden). */
const trazos: Record<string, string[]> = {
  ansiedad: ['M3 8h10a3 3 0 1 0-3-3', 'M3 12h14a3 3 0 1 1-3 3', 'M3 16h7'],
  'animo-bajo-depresion': ['M7 14a4 4 0 0 1 .5-7.9A5.5 5.5 0 0 1 18 8a3.5 3.5 0 0 1-.5 7H7z', 'M9 18l-1 2', 'M13 18l-1 2', 'M17 18l-1 2'],
  'estres-sobrecarga': ['M3 12h3l2-5 4 10 2-5h7'],
  'procesos-de-salud': ['M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z'],
  'duelo-adaptacion': ['M5 19c0-8 5-13 14-14 0 9-5 14-14 14z', 'M5 19l8-8'],
  pareja: ['M9 7a5 5 0 1 0 0 10 5 5 0 1 0 0-10z', 'M15 7a5 5 0 1 0 0 10 5 5 0 1 0 0-10z'],
  'transiciones-de-vida': ['M4 12h14', 'M13 6l6 6-6 6'],
}
const porDefecto = trazos['duelo-adaptacion']

export function IconoEnfoque({ slug, className = 'h-6 w-6' }: { slug: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      {(trazos[slug] ?? porDefecto).map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  )
}
