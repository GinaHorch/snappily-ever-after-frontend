import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate source maps for better debugging
    sourcemap: true,
    // Ensure CSS is properly extracted and minified
    cssCodeSplit: true,
    // Configure asset handling
    assetsDir: 'assets',
    // Ensure proper base URL for assets
    base: '/',
  },
  server: {
    // Configure dev server to handle CORS
    cors: true
  }
})
