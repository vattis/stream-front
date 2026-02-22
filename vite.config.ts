import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/sign-in': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/sign-up': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/log-out': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/shoppingCartProduct': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/productComment': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/profileComment': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
