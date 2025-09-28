const pool = require('../../db');

// Buscar un usuario por correo electrónico
const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM clientes WHERE gmail = $1';
    const values = [email];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('userservice.findUserByEmail error:', error);
        throw new Error('Error al buscar el usuario');
    }
};

// Crear un nuevo usuario
const createUser = async (userData) => {
    const administrador = false;
    // aceptar ambos formatos de keys: { name, email, password, rut } o { nombre_completo, gmail, contraseña, rut }
    const nombre_completo = userData.nombre_completo || userData.name || null;
    const gmail = userData.gmail || userData.email || null;
    const contraseña = userData.contraseña || userData.password || null;
    const { rut } = userData;

    const query = 'INSERT INTO clientes (nombre_completo, gmail, contraseña, rut, administrador) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [nombre_completo, gmail, contraseña, rut, administrador];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('userservice.createUser error:', error);
        throw new Error('Error al crear el usuario');
    }
};

module.exports = { findUserByEmail, createUser };