import { enfoques } from '../../public/data/enfoques'

/**
 * Datos de SEO en un solo lugar. Los usan: el hook useSeo (navegación
 * dentro de la app), el prerender del build (HTML estático por ruta que
 * leen Google y WhatsApp) y el sitemap.
 *
 * Cuando haya dominio propio: definir VITE_SITE_URL en Vercel
 * (ej. https://www.psirebecavelasquez.com) y volver a desplegar.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://psivelasquez.vercel.app').replace(/\/$/, '')
export const NOMBRE_SITIO = 'Rebeca Velásquez, Psicóloga Clínica'
export const IMAGEN_SOCIAL = `${SITE_URL}/og-imagen.jpg`

export interface DatosSeo {
  titulo: string
  descripcion: string
  /** Ruta con "/" inicial, sin dominio. */
  ruta: string
  /** true: no se indexa ni entra al sitemap (páginas sin contenido final). */
  noindex?: boolean
}

const base: DatosSeo[] = [
  {
    ruta: '/',
    titulo: 'Rebeca Velásquez | Psicóloga clínica en Cochabamba',
    descripcion:
      'Psicoterapia presencial y online en Cochabamba con enfoque cognitivo conductual, para adolescentes y adultos. Reserva tu horario.',
  },
  {
    ruta: '/sobre-mi',
    titulo: 'Sobre mí | Rebeca Velásquez, psicóloga clínica',
    descripcion:
      'Psicóloga clínica con enfoque cognitivo conductual, formada en psicología hospitalaria y estudios de familia. Conoce cómo acompaño.',
  },
  {
    ruta: '/enfoques',
    titulo: 'Áreas de trabajo | Psicoterapia en Cochabamba',
    descripcion:
      'Ansiedad, ánimo bajo, estrés, procesos de salud, duelo, relaciones y momentos de cambio: las áreas donde acompaño en psicoterapia.',
  },
  {
    ruta: '/formacion',
    titulo: 'Formación y certificaciones | Rebeca Velásquez',
    descripcion:
      'Licenciatura en Psicología, estudios en Marriage and Family Studies y especialización en psicología hospitalaria. Trayectoria y certificaciones.',
  },
  {
    ruta: '/modalidad',
    titulo: 'Modalidad y ubicación | Terapia presencial y online',
    descripcion:
      'Atención presencial en Cochabamba (Edif. VyV NUR, Parque Fidel Anze) y online por videollamada.',
  },
  {
    ruta: '/faq',
    titulo: 'Preguntas frecuentes | Rebeca Velásquez',
    descripcion:
      'Frecuencia de las sesiones, modalidad, adelanto para reservar y cambios de cita: respuestas a las dudas más comunes antes de empezar.',
  },
  {
    ruta: '/reservar',
    titulo: 'Reservar una sesión | Rebeca Velásquez',
    descripcion: 'Solicita tu sesión de psicoterapia presencial u online: llena un formulario corto y escríbele a Rebeca por WhatsApp.',
  },
  // Textos generales de la V1 (se detallarán en la V2 si Rebeca lo desea).
  {
    ruta: '/aviso-etico',
    titulo: 'Aviso ético | Rebeca Velásquez',
    descripcion: 'Aviso ético y de confidencialidad de la consulta de Rebeca Velásquez.',
  },
  {
    ruta: '/privacidad',
    titulo: 'Política de privacidad | Rebeca Velásquez',
    descripcion: 'Este sitio no guarda tus datos: cómo funciona el formulario de reserva por WhatsApp, cookies y tus derechos.',
  },
]

const porEnfoque: DatosSeo[] = enfoques.map((e) => ({
  ruta: `/enfoques/${e.slug}`,
  titulo: `${e.titulo} | Psicóloga en Cochabamba`,
  descripcion: e.resumen,
}))

export const rutasSeo: DatosSeo[] = [...base, ...porEnfoque]

export function buscarSeo(ruta: string): DatosSeo | undefined {
  const limpia = ruta.length > 1 ? ruta.replace(/\/$/, '') : ruta
  return rutasSeo.find((r) => r.ruta === limpia)
}

export const seo404: DatosSeo = {
  ruta: '/404',
  titulo: 'Página no encontrada | Rebeca Velásquez',
  descripcion: 'La página que buscas no existe.',
  noindex: true,
}

/** Datos estructurados de la portada (schema.org). Solo hechos ya publicados en el sitio. */
export const jsonLdInicio = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['ProfessionalService', 'LocalBusiness'],
      '@id': `${SITE_URL}/#consulta`,
      name: NOMBRE_SITIO,
      description:
        'Psicoterapia presencial y online para adolescentes y adultos, con enfoque cognitivo conductual.',
      url: SITE_URL,
      image: IMAGEN_SOCIAL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Edif. VyV NUR, Parque Fidel Anze #200, Esq. Av. Pando',
        addressLocality: 'Cochabamba',
        addressCountry: 'BO',
      },
      areaServed: 'Cochabamba, Bolivia',
      availableLanguage: 'es',
      founder: { '@id': `${SITE_URL}/#rebeca` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#rebeca`,
      name: 'Rebeca Velásquez',
      jobTitle: 'Psicóloga clínica',
      url: `${SITE_URL}/sobre-mi`,
      image: IMAGEN_SOCIAL,
      alumniOf: [
        { '@type': 'CollegeOrUniversity', name: 'Universidad Católica Boliviana' },
        { '@type': 'CollegeOrUniversity', name: 'BYU-Idaho' },
      ],
    },
  ],
}
