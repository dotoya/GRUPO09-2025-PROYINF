import React, { useState } from 'react';
import './Login.css'; // reutilizamos estilos base

export default function Foto({ userData, solicitudData, onBack, onSuccess }) {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPhoto(null);
      setPreview(null);
      return;
    }

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen.');
      e.target.value = null;
      return;
    }

    // Validar tamaño (máx 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('La imagen es demasiado grande (máx 5MB).');
      e.target.value = null;
      return;
    }

    setPhoto(file);
    // Crear URL para preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      alert('Por favor, toma una foto primero');
      return;
    }

    try {
      const formData = new FormData();
      // Convertir base64 a blob
      const blob = await fetch(photo).then(r => r.blob());
      formData.append('foto', blob);
      
      // Añadir todos los datos previos
      Object.entries(solicitudData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch('http://localhost:3001/api/solicitud/confirmar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al enviar la confirmación');
      }

      onSuccess && onSuccess();
    } catch (error) {
      alert('Error al enviar la confirmación: ' + error.message);
    }
  };

  return (
    <div className="auth-card">
      <button className="back-button" onClick={onBack}>&larr; Volver</button>
      <h2>Confirmar tu Identidad</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Datos de la solicitud:</h3>
        <p><strong>Nombre:</strong> {solicitudData?.nombre}</p>
        <p><strong>RUT:</strong> {solicitudData?.rut}</p>
        <p><strong>Email:</strong> {solicitudData?.email}</p>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        {!capturing && !photo && (
          <button onClick={startCamera} className="primary-button">
            Iniciar Cámara
          </button>
        )}
        
        {capturing && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', maxWidth: '400px', marginBottom: '10px' }}
            />
            <br />
            <button onClick={capturePhoto} className="primary-button">
              Tomar Foto
            </button>
          </>
        )}

        {photo && (
          <div>
            <img
              src={photo}
              alt="Tu foto"
              style={{ width: '100%', maxWidth: '400px', marginBottom: '10px' }}
            />
            <br />
            <button onClick={() => {
              setPhoto(null);
              startCamera();
            }} className="secondary-button">
              Tomar otra foto
            </button>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <form onSubmit={handleSubmit}>
        {photo && (
          <button type="submit" className="primary-button">
            Confirmar y Enviar Solicitud
          </button>
        )}
      </form>
    </div>
  );
}