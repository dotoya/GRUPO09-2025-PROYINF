# server/Dockerfile

FROM node:18-alpine

WORKDIR /app

# Copia solo los package.json para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que la aplicación usará DENTRO del contenedor
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "index.js"]