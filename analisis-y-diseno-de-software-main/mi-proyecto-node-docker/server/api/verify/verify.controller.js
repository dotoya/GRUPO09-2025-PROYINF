// Archivo: server/api/verify/verify.controller.js

const { AzureKeyCredential } = require("@azure/core-auth");
// Usamos el paquete '@azure/ai-form-recognizer' que sí se pudo instalar
const { DocumentAnalysisClient } = require("@azure/ai-form-recognizer"); 
const { FaceClient } = require("@azure/cognitiveservices-face");

// --- Inicialización de Clientes de Azure (usando las variables de entorno) ---
const docClient = new DocumentAnalysisClient(
  process.env.AZURE_DOC_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_DOC_KEY)
);
const faceClient = new FaceClient(
  new AzureKeyCredential(process.env.AZURE_FACE_KEY),
  process.env.AZURE_FACE_ENDPOINT
);

/**
 * Endpoint 1: Extraer datos del carnet de identidad.
 * Recibe la foto del carnet.
 */
exports.extraerDatosCarnet = async (req, res) => {
  console.log("Controlador: extraerDatosCarnet alcanzado.");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo de imagen." });
    }

    // El archivo viene en 'req.file.buffer' gracias a multer
    const poller = await docClient.beginAnalyzeDocument(
      "prebuilt-idDocument", // Modelo pre-entrenado de Azure para IDs
      req.file.buffer
    );
    const { documents } = await poller.pollUntilDone();
    const idDocument = documents && documents[0];

    if (!idDocument) {
      return res.status(400).json({ message: "No se pudo analizar el documento." });
    }

    // Extraemos los campos que nos interesan (los nombres pueden variar un poco)
    const fields = idDocument.fields;
    const datosExtraidos = {
      nombre: fields.FirstName?.content,
      apellidos: fields.LastName?.content,
      rut: fields.DocumentNumber?.content,
      fechaNacimiento: fields.DateOfBirth?.content,
    };

    console.log("Datos extraídos:", datosExtraidos);
    res.status(200).json({ message: "Datos extraídos con éxito", data: datosExtraidos });

  } catch (error) {
    console.error("Error al analizar el carnet:", error);
    res.status(500).json({ message: "Error en el servidor de Azure", error: error.message });
  }
};

/**
 * Endpoint 2: Verificación biométrica.
 * Recibe DOS fotos: la del carnet y la selfie.
 */
exports.verificarRostro = async (req, res) => {
  console.log("Controlador: verificarRostro alcanzado.");
  try {
    // Multer nos entrega los archivos en un objeto 'req.files'
    const fotoCarnet = req.files['fotoCarnet'] ? req.files['fotoCarnet'][0] : null;
    const fotoSelfie = req.files['fotoSelfie'] ? req.files['fotoSelfie'][0] : null;

    if (!fotoCarnet || !fotoSelfie) {
      return res.status(400).json({ message: "Se requieren ambas imágenes: carnet y selfie." });
    }

    // 1. Detectar el rostro en la foto del carnet
    const detectResultCarnet = await faceClient.face.detectWithStream(
      fotoCarnet.buffer,
      { returnFaceId: true }
    );
    const faceIdCarnet = detectResultCarnet[0]?.faceId;
    if (!faceIdCarnet) {
      return res.status(400).json({ message: "No se detectó un rostro en la foto del carnet." });
    }

    // 2. Detectar el rostro en la selfie
    const detectResultSelfie = await faceClient.face.detectWithStream(
      fotoSelfie.buffer,
      { returnFaceId: true }
    );
    const faceIdSelfie = detectResultSelfie[0]?.faceId;
    if (!faceIdSelfie) {
      return res.status(400).json({ message: "No se detectó un rostro en la selfie." });
    }

    // 3. Comparar (Verificar) los dos rostros
    const verifyResult = await faceClient.face.verifyFaceToFace(
      faceIdCarnet,
      faceIdSelfie
    );

    console.log("Resultado de la verificación:", verifyResult);

    // 4. Devolver el resultado al frontend
    if (verifyResult.isIdentical) {
      res.status(200).json({
        message: "Verificación exitosa.",
        isIdentical: true,
        confidence: verifyResult.confidence,
      });
    } else {
      res.status(400).json({
        message: "Las caras no coinciden.",
        isIdentical: false,
        confidence: verifyResult.confidence,
      });
    }
  } catch (error) {
    console.error("Error en la verificación facial:", error);
    res.status(500).json({ message: "Error en el servidor de Azure", error: error.message });
  }
};