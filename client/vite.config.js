import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api":     "http://localhost:5000",
      "/uploads": "http://localhost:5000"
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor":  ["react", "react-dom", "react-router-dom"],
          "three-vendor":  ["three", "@react-three/fiber", "@react-three/drei"],
          "motion-vendor": ["framer-motion"],
          "icons-vendor":  ["react-icons"]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false
  }
})