import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(), // <-- THIS LINE BRINGS YOUR STYLING BACK!
    react()
  ],
  build: {
    outDir: 'dist',
  }
})