import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbx7IFpvD0AL9fHkqlrStsl46MEsyAmJGdq25t95oNV1KhH_kzcNS0k0eBa0woORBzXE'

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
