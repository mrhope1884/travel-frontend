# Giai đoạn 1: Build React bằng Node
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Giai đoạn 2: Khởi chạy bằng Nginx
FROM nginx:alpine
# Copy sản phẩm sau khi build của Vite (thư mục dist) vào thư mục chạy của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 🔥 DÒNG QUAN TRỌNG: Copy file nginx.conf vừa tạo ở Bước 1 vào cấu hình hệ thống Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
