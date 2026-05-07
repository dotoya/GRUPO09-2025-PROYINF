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
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [autofilledFields, setAutofilledFields] = useState([]);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Función separada para extraer los datos al subir la foto
  const extraerDatosDeImagen = async (imageFile) => {
    setScanning(true);
    setError('');
    
    try {
      const formDataApi = new FormData();
      formDataApi.append('fotoCarnet', imageFile);
      
      const response = await fetch('http://localhost:3001/api/verify/escanear-carnet', {
        method: 'POST',
        body: formDataApi,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Error al escanear el carnet');
      }

      // Actualizar el formulario con los datos extraídos
      setForm(prevForm => ({
        ...prevForm,
        // Solo sobrescribe si el campo estaba vacío, o puedes forzar la sobrescritura siempre
        nombre: result.data.nombre || prevForm.nombre,
        apellido: result.data.apellidos || prevForm.apellido, 
        rut: result.data.rut || prevForm.rut,
        nacimiento: result.data.fechaNacimiento || prevForm.nacimiento
      }));

      const filled = [];
      if (result.data.nombre)          filled.push('nombre');
      if (result.data.apellidos)       filled.push('apellido');
      if (result.data.rut)             filled.push('rut');
      if (result.data.fechaNacimiento) filled.push('nacimiento');
      setAutofilledFields(filled);
      setTimeout(() => setAutofilledFields([]), 1500);

    } catch (err) {
      console.error("Error en extracción:", err);
      setError('No se pudieron extraer los datos automáticamente. Por favor, ingrésalos manualmente.');
    } finally {
      setScanning(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) { setFile(null); setPreview(null); return; }
    if (!f.type.startsWith('image/')) { alert('Por favor selecciona un archivo de imagen.'); e.target.value = null; return; }
    if (f.size > 5 * 1024 * 1024) { alert('La imagen es demasiado grande (máx 5MB).'); e.target.value = null; return; }
    
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));

    // Llamamos a la extracción justo después de guardar la imagen
    extraerDatosDeImagen(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!file) { alert('Por favor, adjunta una foto de tu carnet de identidad.'); return; }
    
    // Como ya escaneamos al subir la imagen, aquí solo validamos y enviamos
    setSending(true);
    
    // Opcional: Podrías hacer una última validación cruzada aquí si quieres, 
    // pero como el formulario ya tiene los datos de Azure, basta con enviarlos.
    if (typeof onConfirmar === 'function') {
      onConfirmar(form, file);
    }
    
    setSending(false);
  };

  return (
    <div className="solicitud-page">
      <div className="solicitud-card">
        <h2>Solicitud de Crédito</h2>
        <p className="solicitud-subtitle">Completa tus datos para continuar con la solicitud.</p>
        
          <div className="form-group">
            <label className="form-label">Foto del carnet <span style={{color:'#e11d48',fontSize:'0.8rem'}}>*obligatoria</span></label>
            <label className="file-upload-area" style={{ opacity: scanning ? 0.5 : 1, cursor: scanning ? 'wait' : 'pointer' }}>
              <span className="file-upload-magic-hint">
                ✦ Sube tu carnet y llenamos los datos por ti
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={scanning} />
              <span className="file-upload-icon"></span>
              <span className="file-upload-text">
                {scanning ? 'Extrayendo datos...' : (file ? file.name : 'Haz clic para subir tu carnet')}
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

        <form onSubmit={handleSubmit} className="solicitud-form">
          <div className={`form-group ${autofilledFields.includes('nombre') ? 'field-autofilled' : ''}`}>
            <label className="form-label">Nombre</label>
            <input type="text" name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className={`form-group ${autofilledFields.includes('apellido') ? 'field-autofilled' : ''}`}>
            <label className="form-label">Apellido</label>
            <input type="text" name="apellido" placeholder="Tu apellido" value={form.apellido} onChange={handleChange} required />
          </div>
          <div className={`form-group ${autofilledFields.includes('rut') ? 'field-autofilled' : ''}`}>
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


          <div className="solicitud-actions">
            <button type="button" className="btn-volver" onClick={onBack} disabled={scanning || sending}>← Volver</button>
            <button type="submit" className="btn-confirmar" disabled={sending || scanning}>
              {sending ? 'Verificando...' : 'Confirmar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}