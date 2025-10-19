// Archivo: server/api/auth/auth.model.js

const pool = require('../../db');

// Función para crear la tabla de usuarios si no existe
const createUserTable = async () => {
    const queryText = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            rut VARCHAR(32),
            birthdate DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(queryText);
    console.log("Tabla 'users' verificada/creada con éxito.");
};

// Función para encontrar un usuario por su email
const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

// Función para crear un nuevo usuario en la BD
const createUser = async (email, passwordHash, rut = null, birthdate = null) => {
    const result = await pool.query(
        'INSERT INTO users (email, password_hash, rut, birthdate) VALUES ($1, $2, $3, $4) RETURNING id, email, rut, birthdate',
        [email, passwordHash, rut, birthdate]
    );
    return result.rows[0];
};

module.exports = {
    createUserTable,
    findUserByEmail,
    createUser,
};