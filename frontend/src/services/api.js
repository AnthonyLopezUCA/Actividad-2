// Todas las llamadas al backend. Cada función devuelve una promesa.

// Si no hay VITE_API_URL se usa la ruta relativa (el proxy de Vite la envía al puerto 3001).
const API_URL = import.meta.env.VITE_API_URL || '';

// Función base: hace el fetch, convierte a JSON y lanza un error con el mensaje del backend.
const solicitar = async (ruta, opciones = {}) => {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está encendido el backend?');
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || `Error ${respuesta.status}`);
    error.status = respuesta.status;
    error.datos = datos;
    throw error;
  }

  return datos;
};

// ---------- Ejercicio 1: Adivina el Número ----------
export const enviarIntento = (numero) =>
  solicitar('/api/juego/guess', { method: 'POST', body: JSON.stringify({ numero }) });

export const reiniciarJuego = () => solicitar('/api/juego/reset', { method: 'POST' });

// ---------- Ejercicio 2: Reservas ----------
export const obtenerMenu = () => solicitar('/api/menu');

export const obtenerReserva = () => solicitar('/api/reserva');

export const agregarPlato = (alimentoId, cantidad = 1) =>
  solicitar('/api/reserva/agregar', {
    method: 'POST',
    body: JSON.stringify({ alimentoId, cantidad }),
  });

export const actualizarPorciones = (id, cantidad) =>
  solicitar(`/api/reserva/actualizar-porciones/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ cantidad }),
  });

export const eliminarPlato = (id) => solicitar(`/api/reserva/eliminar/${id}`, { method: 'DELETE' });

// EXTRA
export const confirmarReserva = () => solicitar('/api/reserva/confirmar', { method: 'POST' });
