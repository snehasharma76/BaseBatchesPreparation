/**
 * Vite Configuration
 * 
 * Configuration file for Vite build tool.
 * Vite provides fast HMR (Hot Module Replacement) and optimized builds.
 * 
 * @see https://vite.dev/config/
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Plugins configuration
  plugins: [
    react(), // Enable React Fast Refresh and JSX transformation
  ],
  
  // Server configuration (optional - uncomment to customize)
  // server: {
  //   port: 5173,
  //   open: true, // Auto-open browser on server start
  // },
  
  // Build configuration (optional - uncomment to customize)
  // build: {
  //   outDir: 'dist',
  //   sourcemap: true,
  // },
})
