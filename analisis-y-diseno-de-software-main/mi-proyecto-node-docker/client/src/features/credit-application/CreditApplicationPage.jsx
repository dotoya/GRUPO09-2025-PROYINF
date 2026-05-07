import { useState } from "react";

export default function CreditApplicationPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autofilledFields, setAutofilledFields] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setExtractedData(null);
    setError("");
  };

  const handleExtract = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    // 1. Ahora coincide exactamente con upload.single('fotoCarnet')
    formData.append("fotoCarnet", imageFile); 

    try {
      // 2 y 3. Puerto 3001 y la ruta exacta de tu verify.routes.js
      const response = await fetch("http://localhost:3001/api/verify/escanear-carnet", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al comunicarse con el servidor");
      }

      setExtractedData(result.data);

      setExtractedData(result.data);

      // 👇 agrega esto
      const filled = [];
      if (result.data.nombre)          filled.push('nombre');
      if (result.data.apellidos)       filled.push('apellido');
      if (result.data.rut)             filled.push('rut');
      if (result.data.fechaNacimiento) filled.push('nacimiento');
      setAutofilledFields(filled);
      setTimeout(() => setAutofilledFields([]), 1500);

    } catch (err) {
      console.error("Error en la solicitud:", err);
      setError(err.message || "Error de conexión con el backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Solicitud de crédito</h1>
      <p style={{ color: "#666" }}>Sube una foto de tu carnet para extraer los datos mediante Azure.</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: "1rem", display: "block" }}
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Documento subido"
          style={{ width: "100%", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #ddd" }}
        />
      )}

      <button 
        onClick={handleExtract} 
        disabled={!imageFile || loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Analizando documento con Azure..." : "Extraer datos"}
      </button>

      {error && (
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "8px" }}>
          {error}
        </div>
      )}

      {extractedData && (
        <div style={{ marginTop: "1.5rem", background: "#f4f4f4", padding: "1.5rem", borderRadius: "8px" }}>
          <h3>Datos detectados:</h3>

          <div className={`form-group ${autofilledFields.includes('nombre') ? 'field-autofilled' : ''}`}>
            <label>Nombres</label>
            <input type="text" defaultValue={extractedData.nombre} />
          </div>

          <div className={`form-group ${autofilledFields.includes('apellido') ? 'field-autofilled' : ''}`}>
            <label>Apellidos</label>
            <input type="text" defaultValue={extractedData.apellidos} />
          </div>

          <div className={`form-group ${autofilledFields.includes('rut') ? 'field-autofilled' : ''}`}>
            <label>RUT</label>
            <input type="text" defaultValue={extractedData.rut} />
          </div>

          <div className={`form-group ${autofilledFields.includes('nacimiento') ? 'field-autofilled' : ''}`}>
            <label>Fecha de nacimiento</label>
            <input type="text" defaultValue={extractedData.fechaNacimiento} />
          </div>
        </div>
      )}
    </div>
  );
}