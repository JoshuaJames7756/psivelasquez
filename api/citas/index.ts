import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../../server-lib/auth.js'
import { sql, vencerSlotsExpirados } from '../../server-lib/db.js'

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

function validarBodySolicitar(body: unknown): body is BodySolicitar {
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
 * GET /api/citas?fecha=YYYY-MM-DD           — público, sin datos de paciente
 * GET /api/citas?panel=1&fecha=YYYY-MM-DD   — solo panel, requiere sesión,
 *                                              incluye nombre/teléfono
 * POST /api/citas                           — público, formulario de reserva
 *
 * Fusionado desde citas/index.ts + citas/panel.ts + citas/solicitar.ts
 * para bajar el conteo de funciones serverless (límite de 12 en el
 * plan Hobby de Vercel — ver nota en README). La seguridad real no
 * depende de la URL: la rama `panel` exige verificarSesion() ANTES
 * de tocar la query con el join a pacientes, así que pedir ?panel=1
 * sin sesión sigue devolviendo 401, nunca datos de paciente.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    if (!validarBodySolicitar(req.body)) {
      return res.status(400).json({ error: 'Datos de reserva incompletos o inválidos' })
    }

    const { slotId, nombre, edad, telefono, motivoInicial, primeraVez, modalidad } = req.body

    try {
      // Vence primero cualquier slot cuya ventana de 24-48h ya pasó,
      // para que si ESTE slotId era uno de esos, quede disponible y
      // la reserva pueda seguir en vez de fallar con "ya no disponible".
      await vencerSlotsExpirados()

      const [slot] = await sql`select id, estado from slots_sabado where id = ${slotId}`
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
      console.error('[POST /api/citas]', err)
      return res.status(500).json({ error: 'Error al procesar la reserva' })
    }
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { fecha, panel } = req.query
  const esVistaPanel = panel === '1'

  if (esVistaPanel) {
    const sesion = await verificarSesion(req)
    if (!sesion) {
      return res.status(401).json({ error: 'No autenticado' })
    }
  }

  try {
    await vencerSlotsExpirados()

    const rows = esVistaPanel
      ? fecha
        ? await sql`
            select s.id, s.fecha, s.hora_inicio, s.modalidad, s.estado,
                   s.paciente_id, p.nombre as paciente_nombre, p.telefono as paciente_telefono
            from slots_sabado s
            left join pacientes p on p.id = s.paciente_id
            where s.fecha = ${fecha as string}
            order by s.hora_inicio asc
          `
        : await sql`
            select s.id, s.fecha, s.hora_inicio, s.modalidad, s.estado,
                   s.paciente_id, p.nombre as paciente_nombre, p.telefono as paciente_telefono
            from slots_sabado s
            left join pacientes p on p.id = s.paciente_id
            where s.fecha >= current_date
            order by s.fecha asc, s.hora_inicio asc
            limit 8
          `
      : fecha
        ? await sql`
            select id, fecha, hora_inicio, modalidad, estado
            from slots_sabado
            where fecha = ${fecha as string}
            order by hora_inicio asc
          `
        : await sql`
            select id, fecha, hora_inicio, modalidad, estado
            from slots_sabado
            where fecha >= current_date
            order by fecha asc, hora_inicio asc
            limit 8
          `

    return res.status(200).json({ slots: rows })
  } catch (err) {
    console.error('[GET /api/citas]', err)
    return res.status(500).json({ error: 'Error al obtener los cupos' })
  }
}
