# Base image olarak resmi Node.js image'ını kullanıyoruz
FROM node:14 AS build-stage

# Çalışma dizinini ayarlıyoruz
WORKDIR /app

# Package.json ve package-lock.json dosyalarını kopyalıyoruz
COPY package*.json ./

# Node.js modüllerini yüklüyoruz
RUN npm install

# Uygulama dosyalarını kopyalıyoruz
COPY . .

# Uygulamayı build alıyoruz
RUN npm run build

# Production stage
FROM nginx:1.21.0-alpine

# Build aşamasında oluşan dosyaları nginx dizinine kopyalıyoruz
COPY --from=build-stage /app/build /usr/share/nginx/html

# Nginx default.conf dosyasını kaldırıyoruz ve kendi config dosyamızı ekliyoruz
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Nginx'i expose ediyoruz
EXPOSE 80

# Nginx'i başlatıyoruz
CMD ["nginx", "-g", "daemon off;"]