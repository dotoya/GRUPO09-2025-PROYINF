# 1. CAMBIO CLAVE: Usamos la versión 20 de Node, que es lo que Azure necesita.
FROM node:20-alpine

# El resto de tu Dockerfile se queda igual
WORKDIR /app

# El .dockerignore se encargará de 'node_modules' locales
COPY package*.json ./

# Este 'npm install' ahora se ejecutará en un entorno Node 20
RUN npm install

COPY . .

# El puerto que usa el servidor
EXPOSE 3000

# Usamos el script "start" de tu package.json
# (Que debería ser "nodemon index.js" si seguiste el paso anterior)
CMD ["npm", "start"]