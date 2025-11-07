// Archivo: server/api/verify/verify.controller.js (Corregido)
console.log("✅ verify.controller cargado correctamente");

const { AzureKeyCredential } = require("@azure/core-auth");
const { DocumentAnalysisClient } = require("@azure/ai-form-recognizer"); // Usamos el nombre de paquete correcto
const { FaceClient } = require("@azure/cognitiveservices-face");
// --- 1. IMPORTAMOS LA LIBRERÍA DE AUTENTICACIÓN CORRECTA ---
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

// --- 2. INICIALIZAMOS LOS CLIENTES CON SUS MÉTODOS CORRECTOS ---

// Document Intelligence (el nuevo) usa 'AzureKeyCredential'
const docClient = new DocumentAnalysisClient(
  process.env.AZURE_DOC_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_DOC_KEY)
);

// Face (el más antiguo) usa 'ApiKeyCredentials' de 'ms-rest-js'
const faceClient = new FaceClient(
  // --- 3. ESTA LÍNEA ES LA CORRECCIÓN CLAVE ---
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_FACE_KEY } }),
  process.env.AZURE_FACE_ENDPOINT
);

// --- (El resto de tu controlador 'exports.extraerDatosCarnet' se queda igual) ---
exports.extraerDatosCarnet = async (req, res) => {
  console.log("Controlador: extraerDatosCarnet alcanzado.");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo de imagen." });
    }
    const poller = await docClient.beginAnalyzeDocument(
      "prebuilt-idDocument",
      req.file.buffer
    );
    const { documents } = await poller.pollUntilDone();
    const idDocument = documents && documents[0];
    if (!idDocument) {
      return res.status(400).json({ message: "No se pudo analizar el documento." });
    }
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

// --- (El resto de tu controlador 'exports.verificarRostro' se queda igual) ---
exports.verificarRostro = async (req, res) => {
  console.log("Controlador: verificarRostro alcanzado.");
  try {
    const fotoCarnet = req.files['fotoCarnet'] ? req.files['fotoCarnet'][0] : null;
    const fotoSelfie = req.files['fotoSelfie'] ? req.files['fotoSelfie'][0] : null;

    if (!fotoCarnet || !fotoSelfie) {
      return res.status(400).json({ message: "Se requieren ambas imágenes: carnet y selfie." });
    }

    // 1. Detectar rostro en carnet
    const detectResultCarnet = await faceClient.face.detectWithStream(
      fotoCarnet.buffer, { returnFaceId: true }
    );
    const faceIdCarnet = detectResultCarnet[0]?.faceId;
    if (!faceIdCarnet) {
      return res.status(400).json({ message: "No se detectó un rostro en la foto del carnet." });
    }

    // 2. Detectar rostro en selfie
    const detectResultSelfie = await faceClient.face.detectWithStream(
      fotoSelfie.buffer, { returnFaceId: true }
    );
    const faceIdSelfie = detectResultSelfie[0]?.faceId;
    if (!faceIdSelfie) {
      return res.status(400).json({ message: "No se detectó un rostro en la selfie." });
    }

    // 3. Comparar rostros
    const verifyResult = await faceClient.face.verifyFaceToFace(
      faceIdCarnet,
      faceIdSelfie
    );
    console.log("Resultado de la verificación:", verifyResult);

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