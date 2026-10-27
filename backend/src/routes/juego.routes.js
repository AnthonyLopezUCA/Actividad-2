// Rutas del Ejercicio 1 (montadas en /api/juego).
import { Router } from 'express';
import { adivinar, reiniciar } from '../controllers/juego.controller.js';

const router = Router();

router.post('/guess', adivinar);
router.post('/reset', reiniciar);

export default router;
