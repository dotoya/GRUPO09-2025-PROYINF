const express = require('express');
const router = express.Router();
const simulacionController = require('./simulacion.controller');

// POST /api/simulacion
router.post('/', simulacionController.simular);

module.exports = router;
