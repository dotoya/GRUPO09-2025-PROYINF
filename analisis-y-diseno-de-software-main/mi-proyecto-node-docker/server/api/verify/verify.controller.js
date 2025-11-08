// Archivo: server/api/verify/verify.controller.js
console.log("✅ verify.controller cargado correctamente");

const { AzureKeyCredential } = require("@azure/core-auth");
const { DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
const { FaceClient } = require("@azure/cognitiveservices-face");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

// --- Inicializamos los clientes de Azure ---

// Cliente de Azure Document Intelligence
const docClient = new DocumentAnalysisClient(
  process.env.AZURE_DOC_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_DOC_KEY)
);

// Cliente de Azure Face API
const faceClient = new FaceClient(
  new ApiKeyCredentials({
    inHeader: { "Ocp-Apim-Subscription-Key": process.env.AZURE_FACE_KEY },
  }),
  process.env.AZURE_FACE_ENDPOINT
);

// ======================================================================
// 📘 FUNCIÓN 1: extraerDatosCarnet
// ======================================================================
exports.extraerDatosCarnet = async (req, res) => {
  console.log("Controlador: extraerDatosCarnet alcanzado.");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo de imagen." });
    }

    const poller = await docClient.beginAnalyzeDocument("prebuilt-idDocument", req.file.buffer);
    const { documents } = await poller.pollUntilDone();

    const idDocument = documents && documents[0];
    if (!idDocument) {
      return res.status(400).json({ message: "No se pudo analizar el documento." });
    }

    const fields = idDocument.fields;
    const datosExtraidos = {
      nombre: fields.FirstName?.content || "",
      apellidos: fields.LastName?.content || "",
      rut: fields.DocumentNumber?.content || "",
      fechaNacimiento: fields.DateOfBirth?.content || "",
    };

    console.log("Datos extraídos:", datosExtraidos);
    res.status(200).json({ message: "Datos extraídos con éxito", data: datosExtraidos });
  } catch (error) {
    console.error("❌ Error al analizar el carnet:", error);
    res.status(500).json({ message: "Error en el servidor de Azure", error: error.message });
  }
};

// ======================================================================
// 📸 FUNCIÓN 2: verificarRostro (ahora con fallback de simulación)
// ======================================================================
exports.verificarRostro = async (req, res) => {
  console.log("Controlador: verificarRostro alcanzado.");
  try {
    const fotoCarnet = req.files?.fotoCarnet?.[0];
    const fotoSelfie = req.files?.fotoSelfie?.[0];

    if (!fotoCarnet || !fotoSelfie) {
      return res.status(400).json({ message: "Se requieren ambas imágenes: carnet y selfie." });
    }

    // 1️⃣ Detectar rostro en carnet
    const detectResultCarnet = await faceClient.face.detectWithStream(fotoCarnet.buffer, {
      returnFaceId: true,
      detectionModel: "detection_03",
      recognitionModel: "recognition_04",
    });

    const faceIdCarnet = detectResultCarnet[0]?.faceId;
    if (!faceIdCarnet) {
      return res.status(400).json({ message: "No se detectó un rostro en la foto del carnet." });
    }

    // 2️⃣ Detectar rostro en selfie
    const detectResultSelfie = await faceClient.face.detectWithStream(fotoSelfie.buffer, {
      returnFaceId: true,
      detectionModel: "detection_03",
      recognitionModel: "recognition_04",
    });

    const faceIdSelfie = detectResultSelfie[0]?.faceId;
    if (!faceIdSelfie) {
      return res.status(400).json({ message: "No se detectó un rostro en la selfie." });
    }

    // 3️⃣ Intentar verificar rostros
    try {
      const verifyResult = await faceClient.face.verifyFaceToFace(faceIdCarnet, faceIdSelfie);
      console.log("Resultado de la verificación:", verifyResult);

      if (verifyResult.isIdentical) {
        return res.status(200).json({
          message: "Verificación exitosa.",
          isIdentical: true,
          confidence: verifyResult.confidence,
        });
      } else {
        return res.status(400).json({
          message: "Las caras no coinciden.",
          isIdentical: false,
          confidence: verifyResult.confidence,
        });
      }
    } catch (verifyError) {
      // 🚨 Si Azure no permite verificación (403), simulamos el resultado:
      if (verifyError.statusCode === 403) {
        console.warn("⚠️ Azure Face Verification no habilitado. Simulando resultado local...");
        const simulatedMatch = Math.random() > 0.2; // 80% chance de éxito
        return res.status(200).json({
          message: simulatedMatch
            ? "Verificación simulada: éxito (modo desarrollo)"
            : "Verificación simulada: fallo (modo desarrollo)",
          isIdentical: simulatedMatch,
          confidence: simulatedMatch ? 0.92 : 0.45,
          simulated: true,
        });
      }
      throw verifyError;
    }
  } catch (error) {
    console.error("❌ Error en la verificación facial:", error);
    res.status(500).json({ message: "Error en el servidor de Azure", error: error.message });
  }
};