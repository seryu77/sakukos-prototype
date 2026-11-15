import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The site is served from https://<user>.github.io/sakukos-prototype/
export default defineConfig({
  base: '/sakukos-prototype/',
  plugins: [react()],
})
