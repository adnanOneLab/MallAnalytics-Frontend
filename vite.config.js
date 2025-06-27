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
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Ensure model files maintain their original names and structure
          if (assetInfo.name && (assetInfo.name.includes('model') || assetInfo.name.includes('.bin'))) {
            return 'models/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    copyPublicDir: true, // Ensure public directory is copied to dist
    assetsDir: 'assets',
    // Ensure .bin files are treated as assets
    assetsInclude: ['**/*.bin']
  },
  // Ensure public folder assets are properly served
  publicDir: 'public'
})
