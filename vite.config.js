import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const CODEIGNITER_API = process.env.VITE_CI_API_PROXY || 'http://127.0.0.1:8080'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: CODEIGNITER_API,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
