// Archivo: server/index.js

const express = require('express');
const cors = require('cors'); // Importar cors
const { createUserTable } = require('./api/auth/auth.model'); // Importar función para crear tabla
const authRoutes = require('./api/auth/auth.routes'); // Importar nuestras nuevas rutas

const app = express();
const port = 3000; // El puerto DENTRO de Docker

// --- Middlewares (configuraciones) ---
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend
app.use(express.json()); // Permite que el servidor entienda peticiones con body en formato JSON

// --- Rutas ---
app.use('/api/auth', authRoutes); // Le decimos al servidor que use nuestras rutas de autenticación

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('¡API de autenticación funcionando!');
});

// --- Iniciar Servidor ---
const startServer = async () => {
    try {
        await createUserTable(); // Asegurarse de que la tabla de usuarios exista
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error);
    }
};

startServer();