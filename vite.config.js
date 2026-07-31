import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzv5PKro2tnDRPEAxJI7m7t2aN0JeXWfKktrrPpCrcfHXkvdLV4qGezBYmlE5v4cX2D'

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
