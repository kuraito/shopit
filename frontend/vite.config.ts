import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,  // Permette l'accesso da qualsiasi host
    proxy: {
      '/api': {
        target: 'http://shopit-backend:4000',  // Usa il nome del servizio backend invece di localhost
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
});
