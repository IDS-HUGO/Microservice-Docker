# Etapa 1: Build
FROM node:18-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción con servidor Node.js personalizado
FROM node:18-alpine

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar los archivos construidos desde la etapa de build
COPY --from=build /app/build ./build

# Exponer el puerto
EXPOSE 3000

# Comando para servir la aplicación
CMD ["serve", "-s", "build", "-l", "3000"]