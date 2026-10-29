// Rutas de la reserva (montadas en /api/reserva).
import { Router } from 'express';
import {
  obtenerReserva,
  iniciarNuevaReserva,
  agregarPlato,
  actualizarPorciones,
  eliminarPlato,
  confirmarReserva,
} from '../controllers/reserva.controller.js';

const router = Router();

router.get('/', obtenerReserva);
router.post('/nueva', iniciarNuevaReserva);
router.post('/agregar', agregarPlato);
router.put('/actualizar-porciones/:id', actualizarPorciones);
router.delete('/eliminar/:id', eliminarPlato);
router.post('/confirmar', confirmarReserva); // EXTRA

export default router;
