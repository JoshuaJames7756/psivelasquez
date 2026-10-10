import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useMotionSeguro } from '../hooks/useMotionSeguro'
import { AnilloGiratorio, FormaFlotante, PuntosFondo } from './Decoraciones'
import { LineasFondo } from './LineasFondo'

export type EstiloCabecera = 'ondas' | 'rama' | 'circulos' | 'hojas' | 'puntos'
type Tono = 'sage' | 'terracota' | 'crema'

const fondoPorTono: Record<Tono, string> = {
  sage: 'from-sage-100/80 via-sage-50/60 to-cream-50',
  terracota: 'from-terracotta-100/70 via-terracotta-50/50 to-cream-50',
  crema: 'from-cream-200/80 via-cream-100/60 to-cream-50',
}

/**
 * Encabezado de las páginas internas. Cada página elige un `estilo`
 * (conjunto de decoraciones) y un `tono` (color de fondo) distintos,
 * para que ninguna se sienta como un texto suelto sobre fondo plano
 * ni todas parezcan la misma plantilla. Todo es decorativo
 * (aria-hidden) y respeta prefers-reduced-motion.
 */
export function CabeceraPagina({
  etiqueta,
  titulo,
  intro,
  estilo = 'ondas',
  tono = 'sage',
  ancho = 'max-w-3xl',
  icono,
  children,
}: {
  etiqueta?: string
  titulo: string
  intro?: string
  estilo?: EstiloCabecera
  tono?: Tono
  ancho?: string
  icono?: ReactNode
  children?: ReactNode
}) {
  const { desactivado, duracion } = useMotionSeguro()
  const entrada = (delay: number) => ({
    initial: { opacity: 0, y: desactivado ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duracion(0.55), delay: duracion(delay) },
  })

  return (
    <header
      className={`relative overflow-hidden bg-gradient-to-b px-6 pb-14 pt-16 md:pb-20 md:pt-24 ${fondoPorTono[tono]}`}
    >
      {estilo === 'ondas' && (
        <>
          <LineasFondo variante="ondas" className="inset-x-0 bottom-0 h-20 w-full" />
          <FormaFlotante className="-right-16 -top-10 h-64 w-64" color="bg-terracotta-100/70" />
        </>
      )}
      {estilo === 'rama' && (
        <>
          <LineasFondo variante="rama" className="-right-6 top-0 hidden h-full w-56 md:block" />
          <FormaFlotante className="-left-20 bottom-0 h-56 w-56" color="bg-sage-200/60" />
        </>
      )}
      {estilo === 'circulos' && (
        <>
          <LineasFondo variante="circulos" className="-right-24 -top-24 h-80 w-80" />
          <PuntosFondo className="-bottom-6 left-4 h-32 w-48" />
          <AnilloGiratorio className="right-[18%] top-10 hidden h-16 w-16 md:block" />
        </>
      )}
      {estilo === 'hojas' && (
        <>
          <LineasFondo variante="hojas" className="-right-4 bottom-0 h-56 w-56 md:h-72 md:w-72" />
          <FormaFlotante className="left-[8%] top-6 h-40 w-40" color="bg-terracotta-100/60" duracionCiclo={11} />
        </>
      )}
      {estilo === 'puntos' && (
        <>
          <PuntosFondo className="-right-4 top-4 h-44 w-64" />
          <FormaFlotante className="-bottom-20 right-1/4 h-44 w-44" color="bg-sage-200/40" />
          <AnilloGiratorio className="-left-6 top-6 h-24 w-24" segundos={80} />
        </>
      )}

      <div className={`relative mx-auto ${ancho}`}>
        {icono && (
          <motion.div {...entrada(0)} className="mb-5">
            {icono}
          </motion.div>
        )}
        {etiqueta && (
          <motion.p
            {...entrada(0.05)}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-sage-600"
          >
            {etiqueta}
          </motion.p>
        )}
        <motion.h1 {...entrada(0.12)} className="font-serif-brand text-4xl leading-tight text-sage-900 md:text-5xl">
          {titulo}
        </motion.h1>
        <svg viewBox="0 0 120 10" className="mt-3 h-2.5 w-24" fill="none" aria-hidden="true">
          <motion.path
            d="M2 6 C 30 1, 60 9, 118 3"
            stroke="var(--color-terracotta-400)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: desactivado ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: duracion(0.8), delay: duracion(0.5), ease: 'easeInOut' }}
          />
        </svg>
        {intro && (
          <motion.p {...entrada(0.2)} className="mt-5 max-w-2xl text-lg leading-relaxed text-sage-700">
            {intro}
          </motion.p>
        )}
        {children && <motion.div {...entrada(0.28)}>{children}</motion.div>}
      </div>
    </header>
  )
}
