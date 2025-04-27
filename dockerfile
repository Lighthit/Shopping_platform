FROM node:22.11.0

WORKDIR /app


COPY . .

# ติดตั้ง dependencies
RUN npm install




EXPOSE 55544 
EXPOSE 55543 

# คำสั่งที่ใช้ในการรันทั้ง front-end และ back-end
CMD ["npm", "run", "dev-all"]