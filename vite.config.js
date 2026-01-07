import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/v1/search': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        secure: false,
      },
      '/google-maps': {
        target: 'https://maps.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/google-maps/, ''),
        secure: false,
      },
    },
  },
})
