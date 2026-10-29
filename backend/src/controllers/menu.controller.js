// Controlador del menú del día.
import { menu } from '../data/menu.js';
import { verificarExpiracion } from '../utils/reservaHelpers.js';

// GET /api/menu → devuelve todos los platos con precio y stock actual.
export const obtenerMenu = (req, res) => {
  // Si la reserva expiró, primero se devuelve el stock para mostrar datos reales.
  verificarExpiracion();
  res.json(menu);
};
