// Controlador del Ejercicio 2: reservas de almuerzo.
import { reserva, TIEMPO_LIMITE_MS } from '../data/reserva.js';
import {
  buscarPlato,
  buscarItem,
  calcularTotal,
  estadoReserva,
  verificarExpiracion,
  esEnteroEnRango,
  redondear,
} from '../utils/reservaHelpers.js';

const MENSAJE_EXPIRADA = 'Tu tiempo de reserva terminó. Inicia una nueva reserva.';

// Si la reserva expiró, responde 409 y devuelve true para cortar la petición.
const responderSiExpiro = (res) => {
  if (verificarExpiracion()) {
    res.status(409).json({ mensaje: MENSAJE_EXPIRADA, ...estadoReserva(true) });
    return true;
  }
  return false;
};

// Quita un plato de la reserva (usa filter) y apaga el temporizador si queda vacía.
const quitarItem = (id) => {
  reserva.itemsReservados = reserva.itemsReservados.filter((item) => item.id !== id);
  if (reserva.itemsReservados.length === 0) reserva.expiraEn = null;
};

// 2. GET /api/reserva → estado de la reserva (cierra si el tiempo expiró).
export const obtenerReserva = (req, res) => {
  const expirada = verificarExpiracion();
  res.json(estadoReserva(expirada));
};

// Inicia una nueva reserva y elimina el aviso de expiración anterior.
export const iniciarNuevaReserva = (req, res) => {
  reserva.expirada = false;
  res.json(estadoReserva());
};

// 3. POST /api/reserva/agregar → body { alimentoId, cantidad }
export const agregarPlato = (req, res) => {
  if (responderSiExpiro(res)) return;

  const { alimentoId, cantidad } = req.body ?? {};
  const id = Number(alimentoId);
  const unidades = Number(cantidad ?? 1);

  if (!esEnteroEnRango(unidades, 1)) {
    return res.status(400).json({ mensaje: 'La cantidad debe ser un entero mayor a 0' });
  }

  const plato = buscarPlato(id);
  if (!plato) {
    return res.status(404).json({ mensaje: 'El plato no existe en el menú' });
  }

  if (plato.stock < unidades) {
    return res.status(400).json({ mensaje: 'Stock insuficiente' });
  }

  const nuevoTotal = calcularTotal() + plato.precio * unidades;
  if (redondear(nuevoTotal) > reserva.saldoInicial) {
    return res.status(400).json({ mensaje: 'Saldo insuficiente para esta cantidad' });
  }

  // Descuenta el stock del menú (queda apartado para este usuario).
  plato.stock -= unidades;

  // Si el plato ya estaba en la reserva se suma la cantidad; si no, se agrega.
  const itemExistente = buscarItem(id);
  if (itemExistente) {
    itemExistente.cantidad += unidades;
  } else {
    reserva.itemsReservados.push({ id, cantidad: unidades });
  }

  // El temporizador de 5 minutos empieza con el primer plato.
  if (reserva.expiraEn === null) {
    reserva.expiraEn = Date.now() + TIEMPO_LIMITE_MS;
  }

  res.status(201).json(estadoReserva());
};

// 4. PUT /api/reserva/actualizar-porciones/:id → body { cantidad }
export const actualizarPorciones = (req, res) => {
  if (responderSiExpiro(res)) return;

  const id = Number(req.params.id);
  const nuevaCantidad = Number((req.body ?? {}).cantidad);

  if (!esEnteroEnRango(nuevaCantidad, 0)) {
    return res.status(400).json({ mensaje: 'La cantidad debe ser un entero igual o mayor a 0' });
  }

  const item = buscarItem(id);
  const plato = buscarPlato(id);
  if (!item || !plato) {
    return res.status(404).json({ mensaje: 'El plato no está en tu reserva' });
  }

  // diferencia > 0: se piden más porciones | diferencia < 0: se devuelven porciones.
  const diferencia = nuevaCantidad - item.cantidad;

  if (diferencia > 0) {
    if (plato.stock < diferencia) {
      return res.status(400).json({ mensaje: 'Stock insuficiente' });
    }
    const nuevoTotal = calcularTotal() + plato.precio * diferencia;
    if (redondear(nuevoTotal) > reserva.saldoInicial) {
      return res.status(400).json({ mensaje: 'Saldo insuficiente para esta cantidad' });
    }
  }

  // Ajusta el stock según la diferencia (resta si sube, suma si baja).
  plato.stock -= diferencia;

  if (nuevaCantidad === 0) {
    quitarItem(id);
  } else {
    item.cantidad = nuevaCantidad;
  }

  res.json(estadoReserva());
};

// 5. DELETE /api/reserva/eliminar/:id → quita el plato y devuelve su stock.
export const eliminarPlato = (req, res) => {
  if (responderSiExpiro(res)) return;

  const id = Number(req.params.id);
  const item = buscarItem(id);
  const plato = buscarPlato(id);

  if (!item || !plato) {
    return res.status(404).json({ mensaje: 'El plato no está en tu reserva' });
  }

  plato.stock += item.cantidad;
  quitarItem(id);

  res.json(estadoReserva());
};

// EXTRA: POST /api/reserva/confirmar → bloquea el stock y descuenta el saldo.
export const confirmarReserva = (req, res) => {
  if (responderSiExpiro(res)) return;

  if (reserva.itemsReservados.length === 0) {
    return res.status(400).json({ mensaje: 'No hay platos en tu reserva para confirmar' });
  }

  const totalPagado = calcularTotal();

  // El stock ya fue descontado al agregar: al confirmar ya no se devuelve.
  reserva.saldoInicial = redondear(reserva.saldoInicial - totalPagado);
  reserva.itemsReservados = [];
  reserva.expiraEn = null;

  res.json({
    mensaje: `Reserva confirmada. Se descontaron $${totalPagado.toFixed(2)} de tu saldo.`,
    totalPagado,
    ...estadoReserva(),
  });
};
