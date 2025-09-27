### Build stage for React client
FROM node:18-alpine AS client-build
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

### Final stage: server
FROM node:18-alpine
WORKDIR /app

# Copiar package.json e instalar dependencias de producción
COPY package*.json ./
RUN npm install --production

# Copiar el resto del servidor
COPY . .

# Copiar build del cliente al directorio público que sirve Express
COPY --from=client-build /client/dist ./public

# Asegurar que wait-port esté disponible (fall-safe)
RUN npm install -g wait-port || true

# Inicio (esperar DB y luego start)
CMD ["sh", "-c", "wait-port postgres_db:5432 && npm start"]