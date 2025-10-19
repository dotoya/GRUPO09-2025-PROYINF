// Archivo: server/api/auth/auth.model.js
// Este archivo se actualizó para reflejar la nueva estructura de datos con clientes y solicitudes.

const pool = require('../../db');

/**
 * Crea/verifica las tablas 'clientes' y 'solicitudes' al iniciar la aplicación.
 * Esta función reemplaza a la antigua 'createUserTable'.
 */
const createTables = async () => {
    // 1. Crear tabla de clientes (versión modificada de 'users')
    // Se cambió id por rut como PRIMARY KEY y se añadió nombre_completo.
    const createClientesTableQuery = `
        CREATE TABLE IF NOT EXISTS clientes (
            rut VARCHAR(10) PRIMARY KEY,
            nombre_completo VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    // 2. Crear la nueva tabla de solicitudes
    // Esta tabla tiene una referencia (llave foránea) a la tabla clientes.
    const createSolicitudesTableQuery = `
        CREATE TABLE IF NOT EXISTS solicitudes (
        id SERIAL PRIMARY KEY,
        monto_total INT,
        cuotas INT,
        rut VARCHAR(10) REFERENCES clientes(rut),
        costo_total_cred INT,
        interes FLOAT,
        cae FLOAT,
        valor_cuota_mes INT,
        fecha_primer_pago DATE,
        estado_sol INT,
        renta_liquida INT
    );
    `;

    try {
        await pool.query(createClientesTableQuery);
        await pool.query(createSolicitudesTableQuery);
        console.log("Tablas 'clientes' y 'solicitudes' verificadas/creadas con éxito.");
    } catch (error) {
        console.error("Error al crear las tablas:", error);
        throw error;
    }
};

/**
 * Busca un cliente en la base de datos por su RUT.
 * @param {string} rut - El RUT del cliente a buscar.
 * @returns {Object|null} El objeto del cliente si se encuentra, o null si no.
 */
const findClienteByRut = async (rut) => {
    const result = await pool.query('SELECT * FROM clientes WHERE rut = $1', [rut]);
    return result.rows[0];
};

/**
 * Busca un cliente en la base de datos por su email. (Sigue siendo útil para el login)
 * @param {string} email - El email del cliente a buscar.
 * @returns {Object|null} El objeto del cliente si se encuentra, o null si no.
 */
const findClienteByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
    return result.rows[0];
};

/**
 * Inserta un nuevo cliente en la base de datos.
 * @param {string} rut - El RUT del nuevo cliente.
 * @param {string} nombreCompleto - El nombre completo del nuevo cliente.
 * @param {string} email - El email del nuevo cliente.
 * @param {string} passwordHash - La contraseña ya encriptada (hashed).
 * @returns {Object} El objeto del nuevo cliente creado.
 */
const createCliente = async (rut, nombreCompleto, email, passwordHash) => {
    const result = await pool.query(
        'INSERT INTO clientes (rut, nombre_completo, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING rut, nombre_completo, email',
        [rut, nombreCompleto, email, passwordHash]
    );
    return result.rows[0];
};

// Exportamos las nuevas y actualizadas funciones para que el resto de la aplicación las use.
module.exports = {
    createTables,
    findClienteByRut,
    findClienteByEmail,
    createCliente,
};