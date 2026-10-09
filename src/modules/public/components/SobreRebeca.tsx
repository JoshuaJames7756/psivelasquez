import { LineasFondo } from '../../shared/components/LineasFondo'
import { TituloSeccion } from '../../shared/components/TituloSeccion'
import { Link } from 'react-router-dom'
import rebecaAvatar from '../../../assets/fotos/rebeca-avatar.jpg'

/**
 * Composición distinta a la del Hero a propósito: acá va un recorte
 * circular del rostro (no el retrato completo en arco), así las dos
 * secciones no se leen como la misma foto repetida. Cuando haya una
 * segunda foto realmente distinta de Rebeca, reemplazar el avatar.
 */
export function SobreRebeca() {
  return (
    <section className="con-grain relative overflow-hidden bg-cream-100 px-6 py-16 md:py-24">
      <LineasFondo variante="rama" className="-right-10 top-0 hidden h-full w-72 md:block" />
      <div className="relative mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[auto_1fr] md:gap-14">
        {/* Desktop: círculo grande a la izquierda */}
        <img
          src={rebecaAvatar}
          alt="Rebeca Velásquez"
          className="hidden h-52 w-52 rounded-full object-cover ring-4 ring-cream-50 md:block"
          loading="lazy"
          width={300}
          height={300}
        />

        <div>
          <div className="flex items-center gap-4">
            {/* Mobile: círculo chico junto al título */}
            <img
              src={rebecaAvatar}
              alt="Rebeca Velásquez"
              className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-cream-50 md:hidden"
              loading="lazy"
              width={300}
              height={300}
            />
            <TituloSeccion>Sobre Rebeca</TituloSeccion>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-sage-800">
            Soy psicóloga clínica con enfoque Cognitivo-Conductual. Acompaño a adolescentes y
            adultos que atraviesan ansiedad, procesos de salud difíciles, y momentos de cambio,
            siempre con base ética y un espacio donde puedas ser honesto sin miedo.
          </p>
          <Link
            to="/sobre-mi"
            className="mt-5 inline-block text-sm font-medium text-sage-600 transition-colors hover:text-sage-800"
          >
            Conocer más sobre mí →
          </Link>
        </div>
      </div>
    </section>
  )
}
