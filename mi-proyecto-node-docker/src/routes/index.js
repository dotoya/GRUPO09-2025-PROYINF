const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Cambiamos a authController

// Rutas de autenticación
router.post('/register', authController.registerUser); // Ruta para registrarse
router.post('/login', authController.loginUser);       // Ruta para iniciar sesión

module.exports = router;