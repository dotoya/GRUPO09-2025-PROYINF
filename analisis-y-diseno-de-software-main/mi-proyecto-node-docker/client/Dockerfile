# 1. Usamos una imagen de Node liviana (Alpine Linux)
FROM node:20-alpine

# 2. Creamos y nos movemos a la carpeta de la app dentro del contenedor
WORKDIR /app

# 3. Copiamos solo los archivos de configuración de paquetes primero
# Esto es un truco de Docker para que no reinstale todo si solo cambias código
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos SOLO los archivos necesarios para el cliente
COPY index.html ./
COPY vite.config.js ./
COPY src/ ./src/
COPY public/ ./public/

# 6. Exponemos el puerto de Vite
EXPOSE 5173

# 7. Comando para arrancar en modo desarrollo
# El --host es VITAL para que Docker pueda sacar la señal del contenedor
CMD ["npm", "run", "dev", "--", "--host"]