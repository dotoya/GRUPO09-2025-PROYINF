const express = require('express');
const router = express.Router();
const controller = require('./verify.controller');
console.log("✅ verify.routes cargado correctamente", controller);

// Configuración de Multer para manejar subida de archivos en memoria
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// Ruta para escanear el carnet (recibe 1 archivo llamado 'fotoCarnet')
router.post('/escanear-carnet', upload.single('fotoCarnet'), controller.extraerDatosCarnet);

// Ruta para verificar la cara (recibe 2 archivos: 'fotoCarnet' y 'fotoSelfie')
router.post('/verificar-rostro', upload.fields([
  { name: 'fotoCarnet', maxCount: 1 },
  { name: 'fotoSelfie', maxCount: 1 }
]), controller.verificarRostro);

module.exports = router;