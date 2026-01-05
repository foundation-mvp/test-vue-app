import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  // Base path for S3 subfolder deployment (only in production)
  base:'./',
  build: {
    outDir: 'dist',
    // Single file output for easy deployment
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
}))
