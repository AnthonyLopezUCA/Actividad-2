// Funciones de apoyo reutilizadas por el controlador de reservas.
import { menu } from '../data/menu.js';
import { reserva } from '../data/reserva.js';

// Redondea a 2 decimales para evitar errores de punto flotante (ej. 0.1 + 0.2).
export const redondear = (valor) => Math.round(valor * 100) / 100;

// Busca un plato del menú por su id (usa find).
export const buscarPlato = (id) => menu.find((plato) => plato.id === id);

// Busca un plato dentro de la reserva por su id.
export const buscarItem = (id) => reserva.itemsReservados.find((item) => item.id === id);

// Calcula el total de la reserva: suma de precio × cantidad (usa reduce).
export const calcularTotal = () => {
  const total = reserva.itemsReservados.reduce((suma, item) => {
    const plato = buscarPlato(item.id);
    return plato ? suma + plato.precio * item.cantidad : suma;
  }, 0);
  return redondear(total);
};

// Devuelve todas las unidades reservadas al stock y vacía la reserva.
export const liberarReserva = () => {
  reserva.itemsReservados.forEach((item) => {
    const plato = buscarPlato(item.id);
    if (plato) plato.stock += item.cantidad;
  });
  reserva.itemsReservados = [];
  reserva.expiraEn = null;
};

// Revisa si el tiempo terminó. Si es así, libera la reserva y devuelve true.
export const verificarExpiracion = () => {
  const expirada = reserva.expiraEn !== null && Date.now() >= reserva.expiraEn;
  if (expirada) liberarReserva();
  return expirada;
};

// Segundos que le quedan a la reserva (null si el temporizador no ha empezado).
export const calcularSegundosRestantes = () => {
  if (reserva.expiraEn === null) return null;
  return Math.max(0, Math.ceil((reserva.expiraEn - Date.now()) / 1000));
};

// Arma la respuesta estándar con el estado actual de la reserva.
export const estadoReserva = (expirada = false) => {
  const total = calcularTotal();
  return {
    saldo: redondear(reserva.saldoInicial - total),
    itemsReservados: reserva.itemsReservados.map((item) => ({ id: item.id, cantidad: item.cantidad })),
    total,
    segundosRestantes: calcularSegundosRestantes(),
    expirada,
  };
};

// Valida que un valor sea un entero dentro de un rango (devuelve boolean).
export const esEnteroEnRango = (valor, minimo, maximo = Infinity) =>
  Number.isInteger(valor) && valor >= minimo && valor <= maximo;
