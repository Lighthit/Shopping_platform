# ใช้ Node.js เวอร์ชันที่คุณต้องการ
FROM node:22.11.0

# ตั้ง Working Directory
WORKDIR /Shopping_platform

# คัดลอกไฟล์ทั้งหมดในโปรเจคเข้าไปใน Docker container
COPY . .

# ติดตั้ง dependencies ทั้งหมด (รวม devDependencies ด้วย)
RUN npm install

# เปิดพอร์ตที่ใช้ใน React (Vite) และ Server
EXPOSE 55543



# คำสั่งในการรัน React และ Server พร้อมกัน
CMD ["npm", "run", "dev-all"]