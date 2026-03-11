import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // ========== TEMPORAL DESARROLLO: consumir API desde localhost ==========
      // Redirige /api/* a la API en producción para poder probar en local.
      // ELIMINAR cuando la app esté publicada y ya no se use localhost para desarrollo.
      '/api': {
        target: 'https://api.royriff.com.ar',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
