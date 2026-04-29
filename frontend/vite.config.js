// frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend runs on this port
    proxy: {
      // Any request starting with /api gets forwarded to your backend
      // This means you don't have to type http://localhost:5000 everywhere
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Image files served from backend are also proxied
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})