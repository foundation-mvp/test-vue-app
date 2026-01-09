import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  // Base path for S3 subfolder deployment (only in production)
  base:'./',
  resolve: {
    alias: {
      '@foundation/iframe-sdk': resolve(__dirname, '../packages/iframe-sdk/src')
    }
  },
  server: {
    port: 5778
  },
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
