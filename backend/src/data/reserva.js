// Estado de la reserva en memoria.
export const reserva = {
  saldoInicial: 25.0, // number: saldo de almuerzo disponible
  itemsReservados: [], // arreglo de objetos { id: number, cantidad: number }
  expiraEn: null, // number (timestamp en ms) o null si aún no hay platos
};

// Tiempo límite de la reserva: 5 minutos.
export const TIEMPO_LIMITE_MS = 5 * 60 * 1000;
