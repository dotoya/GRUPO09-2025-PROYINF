import React, { useState, useEffect } from 'react';
import './Login.css'; // reutilizamos estilos simples

export default function Solicitud({ userData, simulacionData, onBack }) {
  const [form, setForm] = useState({
    nombre: userData?.nombre || '',
    apellido: userData?.apellido || '',
    rut: userData?.rut || simulacionData?.formulario?.rut || '',
    email: userData?.email || simulacionData?.formulario?.email || '',
    telefono: userData?.telefono || '',
    direccion: userData?.direccion || '',
    nacimiento: userData?.nacimiento || '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    // liberar object URL cuando cambie o cuando el componente se desmonte
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!f.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen.');
      e.target.value = null;
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (f.size > maxSize) {
      alert('La imagen es demasiado grande (máx 5MB).');
      e.target.value = null;
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      // En producción deberías apuntar a tu endpoint real, aquí es solo un ejemplo.
      // Usamos FormData para incluir la imagen (si se adjunta).
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (file) formData.append('imagen', file);

      const res = await fetch('http://localhost:3001/api/solicitud', {
        method: 'POST',
        // No establecer Content-Type: el navegador asigna el boundary automáticamente
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Error al enviar la solicitud');
      }
      setSent(true);
    } catch (err) {
      alert('No se pudo enviar la solicitud: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-card">
        <button className="back-button" onClick={onBack}>&larr; Volver</button>
        <h2>Solicitud enviada</h2>
        <p>Hemos recibido tus datos. Nuestro equipo se pondrá en contacto contigo pronto.</p>
        <button onClick={onBack}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <button className="back-button" onClick={onBack}>&larr; Volver</button>
      <h2>Solicitud de Crédito - Datos Personales</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
        <input name="rut" placeholder="RUT" value={form.rut} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
        <label style={{ fontSize: '0.85rem' }}>
          Fecha de nacimiento
          <input name="nacimiento" type="date" value={form.nacimiento} onChange={handleChange} required />
        </label>
        <label style={{ fontSize: '0.85rem' }}>
          Adjuntar documento / foto (opcional)
          <input name="imagen" type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        {preview && (
          <div style={{ textAlign: 'center', margin: '8px 0' }}>
            <small>Previsualización:</small>
            <div>
              <img src={preview} alt="preview" style={{ maxWidth: '200px', maxHeight: '200px', marginTop: 6 }} />
            </div>
          </div>
        )}
        <button type="submit" disabled={sending}>{sending ? 'Enviando...' : 'Enviar solicitud'}</button>
      </form>
    </div>
  );
}
