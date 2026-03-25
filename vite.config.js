import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('firebase')) return 'firebase'
          if (id.includes('react-dom') || id.includes('react-icons') || id.includes('react/')) return 'react-vendor'
          if (id.includes('clsx') || id.includes('tailwind-merge')) return 'utils'

          // Everything else in node_modules → vendor chunk
          return 'vendor'
        },
      },
    },
  },
})


