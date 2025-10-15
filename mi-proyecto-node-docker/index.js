const express = require('express');
const path = require('path');
const pool = require('./db'); // Conexión a PostgreSQL
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON en las peticiones POST
app.use(express.json());

/* ============================
  FUNCIÓN PARA CREAR TABLAS
   ============================ */
async function createTables() {
  try {
    // Tabla clientes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        rut VARCHAR(10) PRIMARY KEY,
        gmail VARCHAR(255),
        contraseña VARCHAR(255),
        nombre_completo VARCHAR(255),
        administrador BOOLEAN,
        fecha_de_nacimiento DATE
      )
    `);

    // Tabla solicitudes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS solicitudes (
        id SERIAL PRIMARY KEY,
        monto_total INT,
        cuotas INT,
        rut VARCHAR(10) REFERENCES clientes(rut),
        costo_total_cred INT,
        interes FLOAT,
        CAE FLOAT,
        valor_cuota_mes INT,
        fecha_primer_pago DATE,
        estado_sol INT
      )
    `);

    // Tabla simulación
    await pool.query(`
      CREATE TABLE IF NOT EXISTS simulacion (
        id SERIAL PRIMARY KEY,
        monto_total INT,
        cuotas INT,
        rut VARCHAR(10) REFERENCES clientes(rut),
        costo_total_cred INT,
        interes FLOAT,
        CAE FLOAT,
        valor_cuota_mes INT
      )
    `);

    console.log('Tablas creadas o ya existentes');
  } catch (err) {
    console.error('Error al crear tablas:', err);
    process.exit(1); // Detiene el servidor si no puede crear las tablas
  }
}



// Registrar nuevo cliente
app.post('/api/register', async (req, res) => {
  const { rut, gmail, contraseña, nombre_completo } = req.body;
  if (!rut || !gmail || !contraseña || !nombre_completo) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  try {
    await pool.query(
      `INSERT INTO clientes (rut, gmail, contraseña, nombre_completo, administrador, fecha_de_nacimiento)
      VALUES ($1, $2, $3, $4, false, NULL)`,
      [rut, gmail, contraseña, nombre_completo]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error al registrar cliente:', err);
    res.status(500).json({ error: 'No se pudo registrar el cliente' });
  }
});

// Guardar mensaje de prueba
app.get('/save', async (req, res) => {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, content TEXT)');
    await pool.query('INSERT INTO messages (content) VALUES ($1)', ['Hola desde PostgreSQL!']);
    res.send('Mensaje guardado en la base de datos');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Obtener todos los mensajes
app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

/* ============================
    FRONTEND (Rutas desconocidas)
   ============================ */
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.type('html').send(`
    <!doctype html>
    <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Backend activo</title></head>
      <body>
        <h1>API disponible</h1>
        <p>El frontend no está compilado en <code>/public/index.html</code>.</p>
        <p>Endpoints disponibles: <a href="/messages">/messages</a>, <a href="/save">/save</a></p>
      </body>
    </html>
  `);
});

/* ============================
    INICIO DEL SERVIDOR
   ============================ */
(async () => {
  await createTables(); // Crea las tablas automáticamente al iniciar
  app.listen(port, () => {
    console.log(`App corriendo en http://localhost:${port}`);
  });
})();