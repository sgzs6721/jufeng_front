import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 使用相对路径，支持直接打开index.html
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3001,
    host: true,
    open: true,
    cors: true,
    proxy: {
      '/jufeng/api': {
        target: 'http://localhost:7088',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 3002,
    host: true,
    proxy: {
      '/jufeng/api': {
        target: 'http://localhost:7088',
        changeOrigin: true,
        secure: false
      }
    }
  },
})

