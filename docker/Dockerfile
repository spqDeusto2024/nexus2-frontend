# Etapa de construcción
FROM node:16-alpine as build
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el código fuente y construir
COPY . .
RUN npm run build

# Etapa de producción (solo usa nginx)
FROM nginx:alpine

# Copiar los archivos de construcción desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Ejecutar nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]