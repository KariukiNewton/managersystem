import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': 'http://localhost:5000',
      '/auth': 'http://localhost:5000',
      '/departments': 'http://localhost:5000',
      "/payroll": "http://localhost:5000",
      "/attendance": "http://localhost:5000",
      "/leave": "http://localhost:5000",
    },
  },
})
