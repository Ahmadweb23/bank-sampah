import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyGiJ1D8nodqphTC0_7LH5OwI5fyrmQ3sRELgWLukJ5Wqbbd1owyRWopH6oPdBXS1BH'

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
