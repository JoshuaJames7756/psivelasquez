import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../_lib/auth.js'
import { sql } from '../_lib/db.js'

interface BodyAutoguardado {
  motivo?: string
  intervencion?: string
  tareasHomework?: string
  proximosPasos?: string
}

/**
 * PUT /api/historial/:id
 * Autoguardado progresivo — llamado repetidamente desde el frontend
 * mientras Rebeca escribe (debounce en el cliente, no acá), sin botón
 * manual de "guardar".
 *
 * Contrato: el frontend siempre manda el valor ACTUAL y COMPLETO de
 * cada campo del formulario en cada llamada (incluido "" si el campo
 * quedó vacío), no solo el campo que cambió. Así se evita el bug típico
 * de COALESCE, donde un valor vaciado nunca llega a persistirse porque
 * "" y ausencia de dato se confunden. El hook de autoguardado del panel
 * (useAutoguardado) es responsable de mandar el objeto completo.
 *
 * El debounce/throttle de cuándo llamar a este endpoint vive en ese
 * hook, no acá — esta función solo garantiza una escritura atómica.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT')
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const sesion = await verificarSesion(req)
  if (!sesion) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  const { id } = req.query
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' })
  }

  const body = req.body as BodyAutoguardado

  if (
    body.motivo === undefined &&
    body.intervencion === undefined &&
    body.tareasHomework === undefined &&
    body.proximosPasos === undefined
  ) {
    return res.status(400).json({ error: 'No se envió ningún campo para guardar' })
  }

  // undefined -> null explícito: no dependemos de cómo el driver
  // serializaría "undefined" en un parámetro interpolado (no está
  // documentado); NULL sí tiene semántica SQL estándar con COALESCE.
  const motivo = body.motivo ?? null
  const intervencion = body.intervencion ?? null
  const tareasHomework = body.tareasHomework ?? null
  const proximosPasos = body.proximosPasos ?? null

  try {
    // Los 4 campos van siempre en el UPDATE; si el frontend no mandó
    // un campo en este ciclo puntual, se conserva el valor ya guardado
    // vía COALESCE — pero el contrato de arriba es lo que evita que
    // eso oculte un vaciado real (el frontend nunca omite un campo que
    // el usuario efectivamente vació).
    const [actualizado] = await sql`
      update historial_clinico
      set motivo          = coalesce(${motivo}, motivo),
          intervencion    = coalesce(${intervencion}, intervencion),
          tareas_homework = coalesce(${tareasHomework}, tareas_homework),
          proximos_pasos  = coalesce(${proximosPasos}, proximos_pasos)
      where id = ${id}
      returning id, actualizado_en
    `

    if (!actualizado) {
      return res.status(404).json({ error: 'Registro de historial no encontrado' })
    }

    // Decisión deliberada: NO se audita cada llamada de autoguardado
    // (corre cada ~800ms mientras se escribe, sección 27 del doc —
    // auditar cada una llenaría el log de ruido sin valor real). La
    // auditoría real de "se modificó este historial" ocurre a nivel
    // de sesión de trabajo, no de cada tecleo — pendiente: agregar un
    // evento de auditoría cuando el paciente cambia de foco en la UI
    // (se abandona la edición), no en cada autoguardado individual.
    return res.status(200).json({ historial: actualizado })
  } catch (err) {
    console.error('[PUT /api/historial/:id]', err)
    return res.status(500).json({ error: 'Error al guardar el historial' })
  }
}
