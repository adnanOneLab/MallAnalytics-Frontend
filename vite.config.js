import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // This makes the server accessible on your local network
    port: 5173,
    strictPort: true,
    https: false, // Explicitly disable HTTPS
    cors: true,
    hmr: {
      protocol: 'ws', // Use WebSocket for HMR
      host: 'localhost'
    }
  }
})
