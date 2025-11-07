// Archivo: server/index.js
// (Pega esto y reemplaza todo tu index.js. Ya tiene los cambios de Azure.)

const express = require('express');
const cors = require('cors'); 

// CORRECCIÓN 1: Usamos 'createTables' (la función que crea ambas tablas: clientes y solicitudes)
const { createTables } = require('./api/auth/auth.model'); 
const authRoutes = require('./api/auth/auth.routes');
const simulacionRoutes = require('./api/simulacion/simulacion.routes');
// --- 1. LÍNEA AÑADIDA: Importar rutas de verificación de Azure ---
const verifyRoutes = require('./api/verify/verify.routes');

const app = express();
const port = 3000; // El puerto DENTRO de Docker

// --- Middlewares (configuraciones) ---
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend
app.use(express.json()); // Permite que el servidor entienda peticiones con body en formato JSON

// --- Rutas ---
app.use('/api/auth', authRoutes); // Le decimos al servidor que use nuestras rutas de autenticación
app.use('/api/simulacion', simulacionRoutes); // Le decimos al servidor que use nuestras rutas de simulacion
// --- 2. LÍNEA AÑADIDA: Usar rutas de verificación de Azure ---
app.use('/api/verify', verifyRoutes);

// Ruta de bienvenida (actualizada para reflejar la nueva API)
app.get('/', (req, res) => {
  res.send('¡API de autenticación, simulación y verificación funcionando!');
});

// --- Iniciar Servidor ---
const startServer = async () => {
    try {
        // CORRECCIÓN 2: Llamamos a 'createTables' para que se creen ambas tablas
        await createTables(); // Asegurarse de que ambas tablas (clientes y solicitudes) existan
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error);
    }
};

startServer();