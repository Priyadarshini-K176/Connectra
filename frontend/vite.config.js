import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // This allows the first one to take 5173 
    // and the second one to automatically take 5174
    strictPort: false, 
    hmr: {
      // Prevents Hot Module Replacement conflicts
      clientPort: 5173, 
    }
  },
})