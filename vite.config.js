import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Base path for S3 subfolder deployment (only in production)
  base: './',
  server: {
    port: 5778
  },
  build: {
    outDir: 'dist',
    // Single file output for easy deployment
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
