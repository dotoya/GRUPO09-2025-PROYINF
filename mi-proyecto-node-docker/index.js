const express = require('express');
const path = require('path');
const pool = require('./db'); // Importar la conexión
const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba que guarda un mensaje en la base de datos
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

// Ruta para obtener todos los mensajes
app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Ruta para inicializar las tablas en la base de datos
app.get('/table-cliente', async (req, res) => {
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

    res.send('Tablas creadas correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// En caso de rutas desconocidas (SPA), devolver index.html para que el cliente maneje el enrutado
const fs = require('fs');
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  // Fallback ligero para cuando no existe el frontend compilado (útil en desarrollo sin build)
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

app.listen(port, () => {
  console.log(`App corriendo en http://localhost:${port}`);
});