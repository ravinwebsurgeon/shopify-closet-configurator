import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),svgr()],
  server: {
    historyApiFallback: true,
    host: true, // Ensures the server binds to all network interfaces
    port: 5173, // Use your Vite port
    strictPort: true, // Ensures Vite does not switch ports
    allowedHosts: ['.ngrok-free.app'], // Allow any ngrok subdomain
  },
  build: {
    outDir: 'dist'
  },
  base: './',
})
