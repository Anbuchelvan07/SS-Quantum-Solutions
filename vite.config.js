import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tmpdir } from 'os'
import { join } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir: join(tmpdir(), '.vite-cache-hr-consultancy'),
  server: {
    proxy: {
      '/api': 'http://localhost:5001',
    },
    fs: {
      strict: false,
    },
  },
})
