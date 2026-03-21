# Build stage
FROM node:22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Production stage - Tối giản tối đa
FROM alpine:latest
WORKDIR /app

# Chỉ copy thư mục dist vào image, không cài đặt gì thêm
COPY --from=builder /app/dist ./dist

# Image này không chạy gì cả, nó chỉ đóng vai trò như file zip chở hàng
CMD ["echo", "Static files container - Please extract /app/dist"]