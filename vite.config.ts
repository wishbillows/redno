import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 3000,
    hmr: true,
     watch: {
      usePolling: true,      // ✅ Windows 必须开启
      interval: 100,         // ✅ 每 100ms 轮询一次
    },
    proxy: {
      '/api': {
        target: "http://localhost:8080",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true //antd需要开启这个选项
      }
    },
    modules: {
      localsConvention: "camelCase"
    }
  }
})
