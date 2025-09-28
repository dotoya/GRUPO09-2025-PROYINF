const User = require('../modules/User'); // Modelo de usuario

// Buscar un usuario por correo electrónico
const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

// Crear un nuevo usuario
const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

module.exports = { findUserByEmail, createUser };