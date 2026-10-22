# Contenido redactado por Xion que Rebeca debe aprobar

Todo está escrito en su voz, sin diagnósticos, sin promesas de resultados y sin inventar credenciales.
Lo que sigue es lo único delicado. Si algo no coincide con su práctica real, se cambia ese texto y listo.

## Marcar OK o corregir (8 puntos)

1. **Cómo trabajo, paso "Trabajar"**: dice que a veces propone pequeñas actividades para probar entre sesiones. ¿Es así?
2. **Cómo trabajo, paso "Medir"**: dice que usa escalas breves (GAD-7, PHQ-9) cuando resulta útil. ¿Es así?
3. **Cómo trabajo, cierre**: dice que si el caso excede lo que ofrece, orienta hacia valoración médica o psiquiátrica.
4. **Aviso ético, "Límites de la confidencialidad"**: riesgo serio e inmediato o requerimiento legal. Es el texto con más peso legal.
5. **Aviso ético, "WhatsApp es para coordinar"**: pide no enviar información clínica detallada por ahí. Es una regla suya, ¿la quiere?
6. **Aviso ético y área Ánimo bajo, urgencias**: dice que no es servicio de urgencias y que acuda a emergencias. No se puso ningún número de teléfono a propósito; si quiere uno local, lo da ella.
7. **Preguntas frecuentes, adolescentes**: "con menores coordinamos con madre, padre o tutor". Es una política, confirmar.
8. **Área Dificultades en las relaciones**: no dice si atiende parejas juntas o solo a una persona. ¿Quiere aclararlo?

## Lectura rápida (no urge)

Los textos "qué es", "señales" y "cómo puede ayudar" de las 7 áreas, y las 12 preguntas frecuentes.
Están en `src/modules/public/data/enfoques.ts` y `src/modules/public/components/Faq.tsx`.

## Al aprobar

En `src/modules/shared/seo/sitio.ts` borrar la línea `noindex: true` de `/como-trabajo`, `/aviso-etico` y `/privacidad`.
