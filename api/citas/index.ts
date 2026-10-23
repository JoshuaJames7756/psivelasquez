import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verificarSesion } from '../../server-lib/auth.js'
import { sql, vencerSlotsExpirados } from '../../server-lib/db.js'
import { VERSION_POLITICA } from '../../server-lib/privacidad.js'
import { esFecha, esUuid } from '../../server-lib/validar.js'

// Tope de solicitudes esperando confirmación a la vez: evita que un bot que cambia de
// teléfono acapare todos los cupos de la semana. Pasado el tope se invita a usar WhatsApp.
const MAX_SOLICITUDES_PENDIENTES = 5
const HORAS_VENTANA_EXPIRACION = 48 // confirmado con Joshua: 24-48h, se usa el máximo

interface BodySolicitar {
  slotId: string
  nombre: string
  edad?: number
  telefono?: string
  motivoInicial?: string
  primeraVez: boolean
  sitioWeb?: string
  consentimiento: true
  modalidad: 'presencial' | 'online'
}

function validarBodySolicitar(body: unknown): body is BodySolicitar {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  const telOk = b.telefono === undefined || b.telefono === null || (typeof b.telefono === 'string' && b.telefono.length <= 30)
  const motivoOk = b.motivoInicial === undefined || b.motivoInicial === null || (typeof b.motivoInicial === 'string' && b.motivoInicial.length <= 1000)
  const edadOk = b.edad === undefined || b.edad === null || (Number.isInteger(b.edad) && (b.edad as number) >= 0 && (b.edad as number) <= 120)
  return (
    esUuid(b.slotId) &&
    typeof b.nombre === 'string' &&
    b.nombre.trim().length >= 2 &&
    b.nombre.length <= 120 &&
    telOk &&
    motivoOk &&
    edadOk &&
    b.consentimiento === true &&
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

    // Trampa para bots: el formulario tiene un campo oculto que una persona nunca llena.
    // Se responde "ok" falso para no darle pistas al bot, sin crear nada.
    if (typeof req.body.sitioWeb === 'string' && req.body.sitioWeb.length > 0) {
      return res.status(201).json({ ok: true })
    }

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

      // Un teléfono no puede tener más de una solicitud pendiente a la vez:
      // evita que una sola persona (o un bot) acapare los 8 cupos.
      const digitos = (telefono ?? '').replace(/\D/g, '')
      if (digitos.length >= 6) {
        const [pendiente] = await sql`
          select 1
          from slots_sabado s
          join pacientes p on p.id = s.paciente_id
          where s.estado = 'solicitada'
            and regexp_replace(coalesce(p.telefono, ''), '\D', '', 'g') = ${digitos}
          limit 1
        `
        if (pendiente) {
          return res.status(429).json({
            error: 'Ya tienes una solicitud pendiente. Escríbeme por WhatsApp para coordinarla.',
          })
        }
      }

      const [{ total }] = (await sql`
        select count(*)::int as total from slots_sabado where estado = 'solicitada'
      `) as Array<{ total: number }>
      if (total >= MAX_SOLICITUDES_PENDIENTES) {
        return res.status(429).json({
          error: 'Hay varias solicitudes esperando confirmación. Escríbeme por WhatsApp para reservar tu cupo.',
        })
      }

      // Todo en UNA sentencia: el paciente solo se crea si el cupo sigue
      // disponible, y queda asociado al cupo en el mismo paso (sin pacientes
      // huérfanos si alguien se adelanta).
      const [slotActualizado] = await sql`
        with p as (
          insert into pacientes (nombre, edad, telefono, motivo_inicial, primera_vez, consentimiento_en, consentimiento_version)
          select ${nombre.trim()}, ${edad ?? null}, ${telefono ?? null}, ${motivoInicial ?? null}, ${primeraVez}, now(), ${VERSION_POLITICA}
          where exists (select 1 from slots_sabado where id = ${slotId} and estado = 'disponible')
          returning id
        )
        update slots_sabado
        set estado = 'solicitada',
            paciente_id = (select id from p),
            modalidad = ${modalidad},
            notas_reserva = ${motivoInicial ?? null},
            solicitado_en = now(),
            expira_en = now() + interval '1 hour' * ${HORAS_VENTANA_EXPIRACION}
        where id = ${slotId} and estado = 'disponible' and exists (select 1 from p)
        returning id, estado, expira_en
      `

      if (!slotActualizado) {
        return res.status(409).json({ error: 'Ese cupo se acaba de reservar, elige otro horario' })
      }

      return res.status(201).json({ slot: slotActualizado })
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
  if (fecha !== undefined && !esFecha(fecha)) {
    return res.status(400).json({ error: 'Fecha inválida' })
  }

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
