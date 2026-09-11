import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // GitHub Pages project site needs the repo-name base path until the custom domain is wired up.
  base: mode === 'production' ? '/rockidz-web/' : '/',
}))
