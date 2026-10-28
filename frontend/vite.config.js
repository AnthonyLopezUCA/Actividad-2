// Configuración de Vite: plugin de React, puerto 5173 y proxy de /api hacia el backend.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    host: true,
    allowedHosts: true,
    // El proxy evita escribir la URL completa del backend durante el desarrollo.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
