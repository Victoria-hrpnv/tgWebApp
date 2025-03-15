# Базовый образ
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

ENV VITE_API_URL=https://mikhail.kbnkt.com
ENV VITE_DEV_MODE=false

RUN yarn

COPY . .

RUN yarn build

# Install Nginx using apk
RUN apk add --no-cache nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy vite build artifacts to Nginx directory
RUN mkdir -p /var/lib/nginx/html && cp -r dist/* /var/lib/nginx/html/

# Expose the port
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]