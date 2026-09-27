import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../_lib/db.js'

const HORAS_VENTANA_EXPIRACION = 48 // confirmado con Joshua: 24-48h, se usa el máximo

interface BodySolicitar {
  slotId: string
  nombre: string
  edad?: number
  telefono?: string
  motivoInicial?: string
  primeraVez: boolean
  modalidad: 'presencial' | 'online'
}

function validarBody(body: unknown): body is BodySolicitar {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.slotId === 'string' &&
    typeof b.nombre === 'string' &&
    b.nombre.trim().length > 0 &&
    typeof b.primeraVez === 'boolean' &&
    (b.modalidad === 'presencial' || b.modalidad === 'online')
  )
}

/**
 * POST /api/citas/solicitar
 * Público: el formulario corto de reserva (nombre, edad, motivo breve,
 * primera vez en terapia). Crea el paciente si no existe, marca el slot
 * como "solicitada" y calcula la expiración de la ventana de 48h.
 *
 * NO procesa pago — el pago del 50% se coordina por WhatsApp fuera del
 * sistema. Esta función solo reserva el cupo temporalmente.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método no permitido' })
  }

  if (!validarBody(req.body)) {
    return res.status(400).json({ error: 'Datos de reserva incompletos o inválidos' })
  }

  const { slotId, nombre, edad, telefono, motivoInicial, primeraVez, modalidad } = req.body

  try {
    // El slot debe existir y estar disponible — si no, alguien se adelantó.
    const [slot] = await sql`
      select id, estado from slots_sabado where id = ${slotId}
    `

    if (!slot) {
      return res.status(404).json({ error: 'El cupo no existe' })
    }
    if (slot.estado !== 'disponible') {
      return res.status(409).json({ error: 'Ese cupo ya no está disponible' })
    }

    const [paciente] = await sql`
      insert into pacientes (nombre, edad, telefono, motivo_inicial, primera_vez)
      values (${nombre}, ${edad ?? null}, ${telefono ?? null}, ${motivoInicial ?? null}, ${primeraVez})
      returning id
    `

    const [slotActualizado] = await sql`
      update slots_sabado
      set estado = 'solicitada',
          paciente_id = ${paciente.id},
          modalidad = ${modalidad},
          notas_reserva = ${motivoInicial ?? null},
          solicitado_en = now(),
          expira_en = now() + interval '1 hour' * ${HORAS_VENTANA_EXPIRACION}
      where id = ${slotId} and estado = 'disponible'
      returning id, estado, expira_en
    `

    if (!slotActualizado) {
      // Carrera: alguien lo tomó entre el select y el update.
      return res.status(409).json({ error: 'Ese cupo se acaba de reservar, elige otro horario' })
    }

    return res.status(201).json({ slot: slotActualizado, pacienteId: paciente.id })
  } catch (err) {
    console.error('[POST /api/citas/solicitar]', err)
    return res.status(500).json({ error: 'Error al procesar la reserva' })
  }
}
