// Archivo: client/src/components/Solicitud.jsx (Corregido)

import React, { useState, useEffect } from 'react';
import './Login.css'; // reutilizamos estilos simples

export default function Solicitud({ userData, simulacionData, onBack, onConfirmar }) {
  const [form, setForm] = useState({
    // Precargamos los datos que ya tenemos de 'simulacionData' y 'userData'
    nombre: userData?.nombre || '',
    apellido: userData?.apellido || '',
    rut: simulacionData?.formulario?.rut || userData?.rut || '',
    email: userData?.email || '',
    telefono: userData?.telefono || '',
    direccion: userData?.direccion || '',
    nacimiento: userData?.nacimiento || '',
  });
  
  // --- 1. AHORA 'file' ES LA FOTO DEL CARNET Y ES OBLIGATORIA ---
  const [file, setFile] = useState(null); 
  const [preview, setPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(''); // Estado para mostrar errores de IA

  useEffect(() => {
    // liberar object URL cuando cambie o cuando el componente se desmonte
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // --- 2. COMPLETAMOS LA LÓGICA DE handleFileChange ---
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
    if (preview) URL.revokeObjectURL(preview); // Limpiamos el preview anterior
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      alert('Por favor, adjunta una foto de tu carnet de identidad.');
      return;
    }
    
    setSending(true);
    try {
      // --- 3. LLAMAMOS AL ENDPOINT DE AZURE PARA ESCANEAR EL CARNET ---
      const formDataApi = new FormData();
      formDataApi.append('fotoCarnet', file);

      const response = await fetch('http://localhost:3001/api/verify/escanear-carnet', {
        method: 'POST',
        body: formDataApi,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al escanear el carnet');

      // --- 4. VALIDAMOS EL RUT ESCRITO CONTRA EL RUT ESCANEADO ---
      const rutEscaneado = data.data?.rut?.replace(/\./g, '').trim() || '';
      const rutFormulario = (form.rut || '').replace(/\./g, '').trim();

      console.log('RUT Escaneado:', rutEscaneado, 'RUT Formulario:', rutFormulario);

      if (rutEscaneado && rutEscaneado !== rutFormulario) {
         // Si el RUT escaneado existe y no coincide, avisar y no proceder
         alert(`El RUT del carnet (${rutEscaneado}) no coincide con el RUT ingresado (${rutFormulario}).`);
         setSending(false);
         return;
      }

      // Si todo OK, delegamos al padre para continuar con la solicitud,
      // enviando el formulario y el archivo seleccionado.
      if (typeof onConfirmar === 'function') {
        onConfirmar(form, file);
      } else {
        alert('Solicitud preparada (onConfirmar no está disponible).');
      }

    } catch (err) {
      console.error('Error verificando carnet:', err);
      setError(err.message || 'Error desconocido');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Solicitud de Crédito</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
        <input name="rut" placeholder="RUT (sin puntos, con guion)" value={form.rut} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
        <label style={{ marginTop: '8px' }}>
          Foto del carnet (obligatoria)
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {preview && (
          <div style={{ marginTop: 8 }}>
            <img src={preview} alt="Preview carnet" style={{ maxWidth: '240px', borderRadius: 8 }} />
          </div>
        )}

        {error && <div className="form-error">{error}</div>}

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button type="button" onClick={onBack}>Volver</button>
          <button type="submit" disabled={sending}>{sending ? 'Verificando...' : 'Confirmar Solicitud'}</button>
        </div>
      </form>
    </div>
  );
}