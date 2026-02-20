// Purpose: Vite configuration for fast React development and optimized production builds.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})
