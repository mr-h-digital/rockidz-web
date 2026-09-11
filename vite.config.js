import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Custom domain (rockidz.rockmission.co.za) serves from root.
  base: '/',
}))
