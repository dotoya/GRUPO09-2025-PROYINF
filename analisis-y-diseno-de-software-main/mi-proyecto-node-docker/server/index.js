// ------------------------------
//  Archivo: server/index.js
// ------------------------------

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db'); // 👈 corregido, exportas pool directamente, no { pool }
const verifyRoutes = require('./api/verify/verify.routes');
const authRoutes = require('./api/auth/auth.routes'); // 👈 agrega esto
const simulacionRoutes = require('./api/simulacion/simulacion.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------
//  Middlewares
// ------------------------------
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ------------------------------
//  Rutas
// ------------------------------
app.use('/api/verify', verifyRoutes);
app.use('/api/auth', authRoutes); // 👈 monta las rutas de registro/login
app.use('/api/simulacion', simulacionRoutes);

// ------------------------------
//  Función opcional: crear tablas si no existen
// ------------------------------
async function createTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        email VARCHAR(100),
        fecha_registro TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tablas verificadas o creadas correctamente.');
  } catch (error) {
    console.error('❌ Error al crear tablas:', error);
  } finally {
    client.release();
  }
}

// ------------------------------
//  Inicialización del servidor
// ------------------------------
async function startServer() {
  try {
    await createTables(); // Crea las tablas si es necesario
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
  }
}

startServer();
