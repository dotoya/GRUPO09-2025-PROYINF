// Archivo: server/index.js

const express = require('express');
const cors = require('cors');
// 1. CORRECCIÓN: Importamos la función con su nuevo nombre 'createTables'.
const { createTables } = require('./api/auth/auth.model');
const authRoutes = require('./api/auth/auth.routes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const startServer = async () => {
    try {
        // 2. CORRECCIÓN: Llamamos a la función con su nuevo nombre 'createTables'.
        await createTables();
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}. Listo para recibir peticiones.`);
        });
    } catch (error) {
        // Mejoramos el mensaje de error para que sea más claro
        console.error("No se pudo iniciar el servidor:", error.message);
    }
};

startServer();

