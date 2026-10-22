/**
 * Áreas de trabajo. Fuente única de verdad: usado por
 * EnfoqueTerapeutico.tsx (tarjetas de Home), EnfoquesIndexPage.tsx
 * (índice /enfoques) y EnfoquePage.tsx (detalle /enfoques/:slug).
 *
 * Los títulos y resúmenes son texto de Rebeca. Los campos queEs, senales
 * y comoAyuda fueron redactados por Xion en su voz, con lenguaje prudente
 * (sin diagnósticos, sin promesas de resultados) y están listados en
 * CONTENIDO_A_REVISAR.md para que ella los apruebe. Si el texto cambia,
 * se edita acá una sola vez.
 */
export interface Enfoque {
  slug: string
  titulo: string
  resumen: string
  /** Se muestran en la página de detalle solo si existen. */
  queEs?: string
  senales?: string[]
  comoAyuda?: string
  /** Nota de cuidado (por ejemplo, qué hacer ante una urgencia). */
  aviso?: string
}

export const enfoques: Enfoque[] = [
  {
    slug: 'ansiedad',
    titulo: 'Ansiedad y preocupación constante',
    resumen:
      'Comprender y afrontar pensamientos, preocupaciones y emociones que pueden estar interfiriendo en tu bienestar cotidiano.',
    queEs:
      'La ansiedad es una respuesta natural del cuerpo ante lo que percibimos como una amenaza o una exigencia. Se vuelve un problema cuando aparece con mucha frecuencia o intensidad, se mantiene aunque no haya un peligro real y empieza a limitar tu descanso, tus decisiones o tu día a día.',
    senales: [
      'Preocupación difícil de apagar, incluso por cosas pequeñas',
      'Tensión muscular, inquietud o sensación de estar siempre en alerta',
      'Dificultad para dormir o para concentrarte',
      'Evitar situaciones, lugares o personas por miedo a sentirte mal',
      'Palpitaciones o falta de aire en momentos de mucha angustia',
    ],
    comoAyuda:
      'Desde el enfoque cognitivo-conductual, trabajamos para entender qué situaciones y pensamientos activan tu ansiedad, y qué respuestas, como evitar o darle vueltas a lo mismo, terminan manteniéndola. A partir de ahí practicamos herramientas concretas: regular la activación del cuerpo, revisar los pensamientos anticipatorios y acercarte de a poco a lo que has estado evitando, a un ritmo que puedas sostener. Si tienes síntomas físicos intensos, también es importante que te revise un médico.',
  },
  {
    slug: 'animo-bajo-depresion',
    titulo: 'Ánimo bajo y depresión',
    resumen:
      'Trabajar sobre la pérdida de motivación, tristeza, aislamiento y otros cambios emocionales que afectan tu vida diaria.',
    queEs:
      'Todas las personas pasamos por días de tristeza. Hablamos de ánimo bajo cuando esa tristeza, el desgano o el vacío duran semanas, pesan más de lo que puedes manejar solo y empiezan a afectar tu trabajo, tus estudios, tus vínculos o el cuidado de ti mismo. Solo una evaluación profesional permite saber qué está pasando en cada caso.',
    senales: [
      'Perder el interés o el disfrute en lo que antes te gustaba',
      'Cansancio constante o dificultad para empezar tareas simples',
      'Cambios en el sueño o en el apetito',
      'Pensamientos de culpa, de no valer o de ser una carga',
      'Alejarte de las personas cercanas',
    ],
    comoAyuda:
      'Trabajamos en recuperar de a poco las actividades y rutinas que te hacen bien, y en revisar los pensamientos autocríticos que suelen acompañar al ánimo bajo. Los pasos son pequeños y acordados contigo, porque cuando falta energía, empezar por poco también es avanzar.',
    aviso:
      'Si en algún momento tienes pensamientos de hacerte daño o de no querer seguir, no esperes a tu cita: acude hoy a un servicio de emergencias o busca a una persona de confianza que pueda acompañarte.',
  },
  {
    slug: 'estres-sobrecarga',
    titulo: 'Estrés y sobrecarga emocional',
    resumen:
      'Desarrollar herramientas para afrontar períodos de alta exigencia, cambios y situaciones que generan agotamiento emocional.',
    queEs:
      'El estrés aparece cuando las demandas que enfrentamos, ya sea de trabajo, estudio, familia o salud, superan los recursos con los que sentimos que contamos. Un periodo corto de estrés es normal; cuando se prolonga, puede llevar a un agotamiento físico y emocional.',
    senales: [
      'Sensación de ir siempre contra el reloj o de no llegar a todo',
      'Irritabilidad o poca paciencia con los demás',
      'Dolores de cabeza, tensión o cansancio que no se van con el descanso',
      'Dificultad para desconectarte, incluso en tus momentos libres',
      'Sentir que cada cosa nueva es demasiado',
    ],
    comoAyuda:
      'Revisamos juntos qué te está pesando, qué depende de ti y qué no, y construimos formas realistas de organizar tu tiempo, poner límites y descansar. También practicamos herramientas para bajar la activación del cuerpo en los momentos de mayor tensión.',
  },
  {
    slug: 'procesos-de-salud',
    titulo: 'Procesos de salud y enfermedad',
    resumen:
      'Acompañar el impacto emocional de un diagnóstico, tratamiento, hospitalización o convivencia con una condición médica.',
    queEs:
      'Recibir un diagnóstico, iniciar un tratamiento, pasar por una hospitalización o convivir con una condición médica no es solo un proceso físico. También trae miedo, incertidumbre, cambios en la rutina y en cómo te ves a ti mismo. Este espacio está para acompañar ese impacto emocional.',
    senales: [
      'Miedo o angustia ante resultados, controles o procedimientos',
      'Dificultad para aceptar el diagnóstico o los cambios que trae',
      'Tristeza, enojo o sensación de injusticia',
      'Cansancio de cuidarte o dificultad para seguir las indicaciones médicas',
      'Sentir que nadie a tu alrededor entiende lo que estás viviendo',
    ],
    comoAyuda:
      'Te acompaño a poner en palabras lo que estás viviendo, a manejar la ansiedad que suele venir con los controles y tratamientos, y a encontrar formas de adaptarte a los cambios sin perder de vista lo que sigue siendo importante para ti. Mi trabajo complementa el de tu equipo médico y no lo reemplaza.',
  },
  {
    slug: 'duelo-adaptacion',
    titulo: 'Duelo y procesos de adaptación',
    resumen:
      'Encontrar un espacio para elaborar pérdidas y adaptarse a cambios importantes en distintas etapas de la vida.',
    queEs:
      'El duelo es la respuesta natural ante una pérdida: la de una persona querida, pero también la de una relación, un trabajo, una etapa o un proyecto. No tiene un tiempo ni una forma correctos, y cada persona lo vive a su manera.',
    senales: [
      'Tristeza intensa que llega en oleadas',
      'Dificultad para volver a tus rutinas o para concentrarte',
      'Culpa, enojo o preguntas que no encuentran respuesta',
      'Evitar los recuerdos o, al contrario, no poder dejar de pensar en lo perdido',
      'Sentirte solo en lo que vives, aunque estés rodeado de gente',
    ],
    comoAyuda:
      'Ofrezco un espacio sin prisa y sin juicio para hablar de lo que perdiste, nombrar lo que sientes y encontrar, con el tiempo, una manera de seguir adelante que no te obligue a olvidar. No se trata de superarlo rápido, sino de que el dolor encuentre su lugar y puedas sostenerlo.',
  },
  {
    slug: 'pareja',
    titulo: 'Dificultades en las relaciones',
    resumen:
      'Comprender patrones de interacción, comunicación y emociones que pueden estar afectando los vínculos de pareja o familiares.',
    queEs:
      'Los vínculos cercanos pueden ser una fuente de apoyo y también de mucho desgaste. Cuando se repiten discusiones, silencios o distancias que no logras resolver, puede ayudar mirar con calma cómo se está comunicando cada persona y qué necesita.',
    senales: [
      'Discusiones que se repiten sin llegar a acuerdos',
      'Sentir que no te escuchan o que no sabes cómo decir lo que necesitas',
      'Distancia emocional o silencios prolongados',
      'Dificultad para poner límites o para confiar',
      'Cambios en la relación por una etapa nueva, como hijos, una mudanza o un nuevo trabajo',
    ],
    comoAyuda:
      'Trabajamos en identificar los patrones de comunicación que se repiten, en expresar lo que necesitas con más claridad y en escuchar sin ponerte a la defensiva. El objetivo no es decidir por ti, sino darte más claridad para elegir cómo quieres vivir tus vínculos.',
  },
  {
    slug: 'transiciones-de-vida',
    titulo: 'Transiciones y momentos de cambio',
    resumen:
      'Acompañar períodos de incertidumbre, decisiones importantes o cambios personales que pueden generar malestar emocional.',
    queEs:
      'Mudarte, cerrar una etapa, empezar otra, cambiar de trabajo, convertirte en madre o padre, tomar una decisión grande: los cambios importantes pueden traer ilusión y miedo a la vez. A veces el malestar no viene de que algo vaya mal, sino de no saber todavía cómo es la nueva etapa.',
    senales: [
      'Incertidumbre o indecisión que se alarga',
      'Sentir que ya no te reconoces en tu rutina o en tu rol',
      'Miedo a equivocarte o a perder lo conocido',
      'Compararte con lo que supuestamente deberías estar haciendo',
      'Cansancio o desánimo por tantos cambios juntos',
    ],
    comoAyuda:
      'Te ayudo a ordenar lo que sientes, a aclarar qué es importante para ti y a dar pasos concretos en medio de la incertidumbre, sin presionarte a tener todas las respuestas desde el principio.',
  },
]

export function buscarEnfoque(slug: string | undefined): Enfoque | undefined {
  return enfoques.find((e) => e.slug === slug)
}
