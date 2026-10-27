// Rutas del menú (montadas en /api/menu).
import { Router } from 'express';
import { obtenerMenu } from '../controllers/menu.controller.js';

const router = Router();

router.get('/', obtenerMenu);

export default router;
