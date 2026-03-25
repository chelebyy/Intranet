import path from "node:path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // Docker içinden dışarıya yayın yapması için şart
    port: 5173,
    allowedHosts: [
      'intranet.cheleby.qzz.io' // Cloudflare üzerinden gelen isteğe izin veriyoruz
    ],
    // Alternatif olarak tüm hostlara izin vermek istersen:
    // allowedHosts: true 
  }
})
