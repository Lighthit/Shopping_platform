import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react'  // Import react plugin ที่ถูกต้อง

dotenv.config();  // โหลด .env

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",  // ฟังที่ 0.0.0.0
    port: process.env.PORT_WEB || 5173,  // ใช้ PORT_WEB จาก environment หรือค่าเริ่มต้น 5173
    proxy: {
      '/api': `http://0.0.0.0:${process.env.PORT_SERVER || 11111}`,  // กำหนด proxy ไปที่ server
    },
  }
})