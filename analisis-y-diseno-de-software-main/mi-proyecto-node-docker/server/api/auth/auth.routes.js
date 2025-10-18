// Archivo: server/api/auth/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// Ruta: POST /api/auth/register
router.post('/register', authController.register);

// Ruta: POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;