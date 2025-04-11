import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    }
  },
  css: {
    // Don't process CSS with PostCSS since we're using CDN
    postcss: false
  }
})