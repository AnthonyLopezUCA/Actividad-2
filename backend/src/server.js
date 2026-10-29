// Punto de entrada del backend: configura Express, CORS y monta las rutas.
import express from 'express';
import cors from 'cors';
import juegoRoutes from './routes/juego.routes.js';
import menuRoutes from './routes/menu.routes.js';
import reservaRoutes from './routes/reserva.routes.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS: permite que el frontend (otro puerto) consuma esta API.
app.use(cors({ origin: [FRONTEND_URL, 'http://127.0.0.1:5173'] }));

// Permite leer el cuerpo de las peticiones en formato JSON.
app.use(express.json());

// Ruta de prueba para saber si el servidor está vivo.
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Food DEI funcionando - Desarrollado por Macrowebs' });
});

// Ejercicio 1: Adivina el Número
app.use('/api/juego', juegoRoutes);

// Ejercicio 2: Menú y Reservas
app.use('/api/menu', menuRoutes);
app.use('/api/reserva', reservaRoutes);

// Cualquier ruta no definida responde 404.
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejador de errores inesperados (por ejemplo JSON mal formado).
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const mensaje = status === 400 ? 'Datos enviados no válidos' : 'Error interno del servidor';
  res.status(status).json({ mensaje });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
