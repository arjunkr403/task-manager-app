import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'dist'
  },
  server: {
    // bind to all interfaces so the dev server is reachable from the host when running inside Docker
    host: '0.0.0.0',
    // HMR client will connect back to the host where you're browsing from; this default works for most setups.
    hmr: {
      // ensure the client connects to the mapped port on the host machine
      clientPort: 5173
    },
    proxy: {
      // In docker-compose the backend is available at the service name `back` on port 5000
      '/back': {
        target: 'http://back:5000',
        changeOrigin: true
      }
    }
  }
})
