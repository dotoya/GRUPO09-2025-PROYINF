import React, { useState, useEffect } from 'react';
import '../App.css';
import './Solicitud.css';

export default function Solicitud({ userData, simulacionData, onBack, onConfirmar }) {
  const [form, setForm] = useState({
    nombre: userData?.nombre || '',
    apellido: userData?.apellido || '',
    rut: simulacionData?.formulario?.rut || userData?.rut || '',
    email: userData?.email || '',
    telefono: userData?.telefono || '',
    direccion: userData?.direccion || '',
    nacimiento: userData?.nacimiento || '',
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) { setFile(null); setPreview(null); return; }
    if (!f.type.startsWith('image/')) { alert('Por favor selecciona un archivo de imagen.'); e.target.value = null; return; }
    if (f.size > 5 * 1024 * 1024) { alert('La imagen es demasiado grande (máx 5MB).'); e.target.value = null; return; }
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) { alert('Por favor, adjunta una foto de tu carnet de identidad.'); return; }
    setSending(true);
    try {
      const formDataApi = new FormData();
      formDataApi.append('fotoCarnet', file);
      const response = await fetch('http://localhost:3001/api/verify/escanear-carnet', {
        method: 'POST',
        body: formDataApi,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al escanear el carnet');
      const rutEscaneado = data.data?.rut?.replace(/\./g, '').trim() || '';
      const rutFormulario = (form.rut || '').replace(/\./g, '').trim();
      if (rutEscaneado && rutEscaneado !== rutFormulario) {
        alert(`El RUT del carnet (${rutEscaneado}) no coincide con el RUT ingresado (${rutFormulario}).`);
        setSending(false);
        return;
      }
      if (typeof onConfirmar === 'function') onConfirmar(form, file);
    } catch (err) {
      setError(err.message || 'Error desconocido');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="solicitud-page">
      <div className="solicitud-card">
        <h2>Solicitud de Crédito</h2>
        <p className="solicitud-subtitle">Completa tus datos para continuar con la solicitud.</p>

        <form onSubmit={handleSubmit} className="solicitud-form">
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input type="text" name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Apellido</label>
            <input type="text" name="apellido" placeholder="Tu apellido" value={form.apellido} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">RUT</label>
            <input type="text" name="rut" placeholder="12345678-9" value={form.rut} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input type="email" name="email" placeholder="tucorreo@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono <span style={{fontWeight:400,color:'#94a3b8',fontSize:'0.8rem'}}>(opcional)</span></label>
            <input type="tel" name="telefono" placeholder="+56 9 1234 5678" value={form.telefono} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Dirección <span style={{fontWeight:400,color:'#94a3b8',fontSize:'0.8rem'}}>(opcional)</span></label>
            <input type="text" name="direccion" placeholder="Tu dirección" value={form.direccion} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Foto del carnet <span style={{color:'#e11d48',fontSize:'0.8rem'}}>*obligatoria</span></label>
            <label className="file-upload-area">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <span className="file-upload-icon"></span>
              <span className="file-upload-text">
                {file ? file.name : 'Haz clic para subir tu carnet'}
              </span>
              <span className="file-upload-hint">JPG, PNG · máx 5MB</span>
            </label>
          </div>

          {preview && (
            <div className="carnet-preview">
              <img src={preview} alt="Preview carnet" />
            </div>
          )}

          {error && <div className="form-error">⚠️ {error}</div>}

          <div className="solicitud-actions">
            <button type="button" className="btn-volver" onClick={onBack}>← Volver</button>
            <button type="submit" className="btn-confirmar" disabled={sending}>
              {sending ? 'Verificando...' : 'Confirmar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}