import React, { useState, useRef, useEffect } from 'react';
import './Login.css'; // reutilizamos estilos base

export default function Foto({ userData, solicitudData, onBack, onSuccess }) {
  const [photo, setPhoto] = useState(null); // dataURL or null
  const [preview, setPreview] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

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

    // Leer como dataURL para preview y envío consistente
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result); // dataURL
      setPreview(reader.result);
      // Si la cámara estaba activa, detenerla
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // start/stop/capture camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCapturing(true);
      setPhoto(null);
      setPreview(null);
    } catch (err) {
      alert('No se pudo acceder a la cámara: ' + err.message);
    }
  };

  const stopCamera = () => {
    setCapturing(false);
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPhoto(dataUrl);
    setPreview(dataUrl);
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      alert('Por favor, toma una foto primero');
      return;
    }

    try {
      const formData = new FormData();
      // photo es dataURL -> convertir a blob
      const blob = await (await fetch(photo)).blob();
      formData.append('foto', blob, 'foto.jpg');

      // Añadir todos los datos previos (proteger si solicitudData es undefined)
      Object.entries(solicitudData || {}).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
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
        {!capturing && !preview && (
          <>
            <button onClick={startCamera} className="primary-button" style={{ marginRight: 8 }}>
              Iniciar Cámara
            </button>
            <label style={{ display: 'inline-block', marginTop: 8 }}>
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
              <span className="secondary-button">Subir imagen</span>
            </label>
          </>
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
            <button onClick={capturePhoto} className="primary-button" style={{ marginRight: 8 }}>
              Tomar Foto
            </button>
            <button onClick={stopCamera} className="secondary-button">Cancelar</button>
          </>
        )}

        {preview && (
          <div>
            <img
              src={preview}
              alt="Tu foto"
              style={{ width: '100%', maxWidth: '400px', marginBottom: '10px' }}
            />
            <br />
            <button onClick={() => { setPhoto(null); setPreview(null); }} className="secondary-button" style={{ marginRight: 8 }}>
              Eliminar
            </button>
            <button onClick={startCamera} className="primary-button">Tomar otra foto</button>
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