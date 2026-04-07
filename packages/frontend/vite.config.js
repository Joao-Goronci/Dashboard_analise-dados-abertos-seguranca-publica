import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/grafico': 'http://localhost:5000',
      '/chat': 'http://localhost:5000'
    }
  }
})
