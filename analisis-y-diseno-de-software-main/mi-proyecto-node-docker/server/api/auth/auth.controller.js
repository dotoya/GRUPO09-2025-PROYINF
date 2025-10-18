// Archivo: server/api/auth/auth.controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./auth.model');

const JWT_SECRET = 'un_secreto_muy_secreto_que_debes_cambiar';

// Controlador para la ruta de Registro
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password || password.length < 6) {
            return res.status(400).json({ message: "Por favor, proporciona un email y una contraseña de al menos 6 caracteres." });
        }

        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "El email ya está en uso." });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.createUser(email, passwordHash);

        res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

// Controlador para la ruta de Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son requeridos." });
        }

        const user = await User.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "Inicio de sesión exitoso", token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};