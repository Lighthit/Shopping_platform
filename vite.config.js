import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react'  // Import react plugin ที่ถูกต้อง
dotenv.config();
// https://vite.dev/config/
export default defineConfig({
  
  plugins: [react()],
  server: {
    host: process.env.HOST || "127.0.0.1",
    port: process.env.PORT_WEB || 5173,
    proxy: {
      '/api': `http://${process.env.HOST || "127.0.0.1" }:${process.env.PORT_SERVER || 11111}`,
    },
  }
})
