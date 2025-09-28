const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
    const { name, email, password, rut } = req.body;

    if (!name || !email || !password || !rut) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const newUser = await userService.createUser({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
};

// Iniciar sesión
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario existe
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};

module.exports = { registerUser, loginUser };