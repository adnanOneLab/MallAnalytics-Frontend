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
    assetsInclude: ['**/*.bin', '**/*.shard*'], // Include model files as assets
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep model files in models directory with original names
          if (assetInfo.name && (assetInfo.name.includes('model') || assetInfo.name.includes('shard'))) {
            return 'models/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
})
