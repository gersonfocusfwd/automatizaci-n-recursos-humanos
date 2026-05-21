import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      /* Redirige todas las llamadas /api hacia json-server en el puerto 3001 */
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (ruta) => ruta.replace(/^\/api/, ''),
      },
      /* Redirige todas las llamadas /gemini hacia la API de Google Gemini */
      '/gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (ruta) => ruta.replace(/^\/gemini/, ''),
      },
    },
  },
})
