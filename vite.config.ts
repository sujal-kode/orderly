import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    adonisjs({
      entryPoints: ['resources/js/app.tsx'],
      reload: ['resources/views/**/*.edge'],
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },
})