const pool = require('../../db');

// Buscar un usuario por correo electrónico
const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM clientes WHERE gmail  = $1';
    const values = [email];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al buscar el usuario');
    }
};

// Crear un nuevo usuario
const createUser = async (userData) => {
    const administrador = false;
    const { nombre_completo, email, contraseña, rut } = userData;
    const query = 'INSERT INTO clientes (nombre_completo, gmail, contraseña, rut, administrador) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [nombre_completo, email, contraseña, rut, administrador];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al crear el usuario');
    }
};

module.exports = { findUserByEmail, createUser };