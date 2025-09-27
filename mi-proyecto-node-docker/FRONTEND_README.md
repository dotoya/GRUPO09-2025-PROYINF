# Frontend (React) — Instrucciones

Este proyecto incluye un cliente React (Vite) en `client/`. El `Dockerfile` ya está configurado como multi-stage: primero construye el cliente y luego copia la carpeta `dist/` resultante a `public/` del servidor para que Express lo sirva.

Cómo construir y ejecutar (producción) con Docker Compose:

```bash
cd mi-proyecto-node-docker
docker compose up --build
```

Luego abre: http://localhost:3000

Notas para desarrollo local del cliente:
- Para trabajar en el cliente con hot-reload:

```bash
cd mi-proyecto-node-docker/client
npm install
npm run dev
```

Esto levanta Vite en :5173 por defecto; durante desarrollo puedes configurar el proxy a la API (`/save`, `/messages`) en `vite.config.js` si lo deseas.

Si cambias el frontend y quieres reconstruir la imagen con Docker Compose, ejecuta:

```bash
cd mi-proyecto-node-docker
docker compose build --no-cache app
docker compose up
```

Si deseas que preserve los archivos del host montados (modo dev con docker), avísame y lo configuro para que el servidor use `public/` desde el host en desarrollo.
