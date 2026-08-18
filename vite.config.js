import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxhEBbGRW14N0x2-F8TW3tRUxRQygQ5jQea7c08tTTOEHVOmcbiVGDjgtdm6vo5Q9BT'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: SCRIPT_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/exec')
      }
    }
  }
})
