// Archivo: server/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ✅ importación correcta

// Importamos la función correcta desde el modelo
const { createUserTable } = require('./api/auth/auth.model'); 

// Importamos las rutas
const verifyRoutes = require('./api/verify/verify.routes');
const authRoutes = require('./api/auth/auth.routes');
const simulacionRoutes = require('./api/simulacion/simulacion.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors()); // ✅ ya funciona correctamente
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas ---
app.use('/api/verify', verifyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/simulacion', simulacionRoutes);

app.get('/', (req, res) => {
  res.send('¡API de autenticación, simulación y verificación funcionando!');
});

// --- Iniciar Servidor ---
async function startServer() {
  try {
    // ✅ Llamamos a la función que crea la tabla de usuarios
    await createUserTable();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
  }
}

startServer();
