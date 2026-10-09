import { motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LineasFondo } from '../../shared/components/LineasFondo'
import { TituloSeccion } from '../../shared/components/TituloSeccion'
import { useMotionSeguro } from '../../shared/hooks/useMotionSeguro'
import { enfoques } from '../data/enfoques'

/**
 * Carrusel horizontal con scroll-snap nativo: funciona con el dedo en
 * móvil, con trackpad y con teclado (flechas). Los botones solo
 * desplazan el mismo scroll, así no hay un segundo estado que pueda
 * desincronizarse. Sin autoplay a propósito: el movimiento que no
 * controlas es un problema de accesibilidad.
 */
export function EnfoqueTerapeutico() {
  const pista = useRef<HTMLDivElement>(null)
  const [activo, setActivo] = useState(0)
  const { desactivado } = useMotionSeguro()

  const actualizarActivo = useCallback(() => {
    const el = pista.current
    if (!el) return
    const tarjetas = Array.from(el.children) as HTMLElement[]
    const centro = el.scrollLeft + el.clientWidth / 2
    let mejor = 0
    let distancia = Infinity
    tarjetas.forEach((t, i) => {
      const d = Math.abs(t.offsetLeft + t.offsetWidth / 2 - centro)
      if (d < distancia) {
        distancia = d
        mejor = i
      }
    })
    setActivo(mejor)
  }, [])

  useEffect(() => {
    actualizarActivo()
  }, [actualizarActivo])

  function irA(indice: number) {
    const el = pista.current
    const tarjeta = el?.children[indice] as HTMLElement | undefined
    if (!el || !tarjeta) return
    el.scrollTo({
      left: tarjeta.offsetLeft - (el.clientWidth - tarjeta.offsetWidth) / 2,
      behavior: desactivado ? 'auto' : 'smooth',
    })
  }

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Áreas de trabajo"
      className="con-grain relative overflow-hidden bg-sage-50 py-16 md:py-20"
    >
      <LineasFondo variante="ondas" className="inset-x-0 top-0 h-40 w-full" />

      <div className="relative mx-auto flex max-w-6xl items-end justify-between gap-4 px-6">
        <div>
          <TituloSeccion>Enfoque terapéutico</TituloSeccion>
          <p className="mt-3 max-w-xl text-sage-700">
            Estas son las áreas donde trabajo con más frecuencia. Desliza para recorrerlas.
          </p>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => irA(Math.max(0, activo - 1))}
            disabled={activo === 0}
            aria-label="Área anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-300 text-sage-700 transition-colors hover:bg-sage-100 disabled:opacity-30"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => irA(Math.min(enfoques.length - 1, activo + 1))}
            disabled={activo === enfoques.length - 1}
            aria-label="Área siguiente"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-700 text-cream-50 transition-colors hover:bg-sage-800 disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={pista}
        onScroll={actualizarActivo}
        tabIndex={0}
        className="sin-scrollbar relative mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-4 md:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
      >
        {enfoques.map((e, i) => (
          <motion.article
            key={e.slug}
            animate={{ opacity: i === activo ? 1 : 0.6, scale: i === activo || desactivado ? 1 : 0.97 }}
            transition={{ duration: desactivado ? 0 : 0.3 }}
            aria-label={`${i + 1} de ${enfoques.length}: ${e.titulo}`}
            className="relative flex w-[82%] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-sage-200 bg-cream-50 p-7 shadow-sm sm:w-[22rem]"
          >
            <span
              aria-hidden="true"
              className="font-serif-brand pointer-events-none absolute -right-2 -top-4 text-8xl italic text-sage-100"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-serif-brand relative mt-10 text-xl leading-snug text-sage-900">
              {e.titulo}
            </h3>
            <p className="relative mt-3 flex-1 text-sm leading-relaxed text-sage-700">
              {e.resumen}
            </p>
            <Link
              to={`/enfoques/${e.slug}`}
              className="relative mt-5 inline-flex items-center gap-1 text-sm font-medium text-sage-700 transition-colors hover:text-sage-900"
            >
              Conocer más <span aria-hidden="true">→</span>
            </Link>
          </motion.article>
        ))}
        <div className="w-1 shrink-0" aria-hidden="true" />
      </div>

      <div className="relative mx-auto mt-4 flex max-w-6xl items-center justify-between px-6">
        <div className="flex gap-2" role="group" aria-label="Elegir área">
          {enfoques.map((e, i) => (
            <button
              key={e.slug}
              type="button"
              onClick={() => irA(i)}
              aria-label={`Ir a ${e.titulo}`}
              aria-current={i === activo}
              className={`h-2 rounded-full transition-all ${
                i === activo ? 'w-6 bg-sage-700' : 'w-2 bg-sage-300'
              }`}
            />
          ))}
        </div>
        <Link
          to="/enfoques"
          className="text-sm font-medium text-sage-600 underline transition-colors hover:text-sage-800"
        >
          Ver las {enfoques.length} áreas
        </Link>
      </div>
    </section>
  )
}
