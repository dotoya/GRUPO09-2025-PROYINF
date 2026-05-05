// Archivo: client/src/components/Foto.jsx

import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

export default function Foto({ userData, solicitudData, fotoCarnet, onBack, onSuccess }) {
  const [photoDataURL, setPhotoDataURL] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null); // <-- NUEVO: referencia al input file

  useEffect(() => {
    // cleanup al desmontar
    return () => {
      stopCamera();
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCapturing(true);
      setPreview(null);
      setPhotoFile(null);
      setPhotoDataURL(null);
    } catch (err) {
      alert('No se pudo acceder a la cámara: ' + err.message);
    }
  };

  const stopCamera = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    } catch {
      /* ignore */
    } finally {
      setCapturing(false);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const handlePhotoChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      setPhotoFile(null);
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
      setPreview(null);
      return;
    }
    if (!f.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen.');
      e.target.value = null;
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (f.size > maxSize) {
      alert('La imagen es demasiado grande (máx 5MB).');
      e.target.value = null;
      return;
    }
    setPhotoFile(f);
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
    setPhotoDataURL(null);
    stopCamera();
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
    const file = dataURLtoFile(dataUrl, 'selfie.jpg');
    setPhotoFile(file);
    setPhotoDataURL(dataUrl);
    setPreview(dataUrl);
    stopCamera();
  };

  const retake = () => {
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(null);
    setPhotoFile(null);
    setPhotoDataURL(null);
    startCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile) {
      alert('Por favor, toma o sube una selfie.');
      return;
    }
    if (!fotoCarnet) {
      alert('Error: falta la foto del carnet. Vuelve al paso anterior.');
      return;
    }

    // Bypass: simulamos siempre aceptación localmente sin llamar al API
    setIsLoading(true);
    try {
      // Simular pequeña latencia como si fuera IA
      const simulatedResult = {
        isIdentical: true,
        confidence: 0.99,
        bypassed: true,
        message: 'Verificación simulada: aceptación forzada (bypass)'
      };

      // Esperar brevemente y luego invocar el callback con el resultado
      await new Promise((res) => setTimeout(res, 500));
      if (typeof onSuccess === 'function') onSuccess(simulatedResult);
    } catch (error) {
      alert('Error interno al simular la verificación: ' + (error?.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <button className="back-button" onClick={onBack}>&larr; Volver</button>
      <h2>Confirmar tu Identidad - Paso 2/2</h2>

      <div style={{ textAlign: 'center', margin: '16px 0' }}>
        {!capturing && !preview && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button type="button" onClick={startCamera}>Usar cámara</button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Subir imagen
            </button>
            {/* input oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {capturing && (
          <div>
            <video
              ref={videoRef}
              style={{ maxWidth: '100%', borderRadius: 8 }}
              autoPlay
              muted
              playsInline
            />
            <div style={{ marginTop: 8 }}>
              <button type="button" onClick={capturePhoto}>Capturar</button>
              <button type="button" onClick={stopCamera}>Cancelar</button>
            </div>
          </div>
        )}

        {preview && (
          <div style={{ marginTop: 12 }}>
            <img
              src={preview}
              alt="Preview selfie"
              style={{ maxWidth: '320px', borderRadius: 8 }}
            />
            <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button type="button" onClick={retake}>Volver a intentar</button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        {preview && (
          <button
            type="submit"
            className="primary-button"
            disabled={isLoading}
          >
            {isLoading ? 'Verificando con IA...' : 'Confirmar y Enviar Solicitud'}
          </button>
        )}
      </form>
    </div>
  );
}
