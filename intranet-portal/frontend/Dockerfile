# Dockerfile for React + Vite Frontend
# This Dockerfile includes both dev and prod stages

# --- Build Stage (for Production) ---
FROM node:22-alpine AS build

WORKDIR /app

# Bağımlılıkları yükle (önbellekleme için önce package dosyaları)
COPY package.json package-lock.json ./
RUN npm ci

# Kaynak kodları kopyala
COPY . .

# Uygulamayı derle (dist klasörü oluşur)
RUN npm run build

# --- Production Stage (Nginx ile Sunum) ---
FROM nginx:alpine AS production
# Nginx ayarını kopyala (Gerekirse özel nginx.conf eklenebilir)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Derlenen dosyaları Nginx'in sunacağı yere kopyala
COPY --from=build /app/dist /usr/share/nginx/html

# Portu aç
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# --- Development Stage (Kodlarken kullanacağımız) ---
FROM node:22-alpine AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]
