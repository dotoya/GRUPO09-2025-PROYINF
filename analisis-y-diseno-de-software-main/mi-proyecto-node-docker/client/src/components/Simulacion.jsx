import React, { useState } from 'react';
 
const initialState = { rut: '', edad: '', monto: '', renta: '', cuotas: '' };
 
export default function Simulacion({ userData, onBack, onRequestSolicitud }) {
  const [formData, setFormData] = useState({
    ...initialState,
    rut: userData?.rut || '',
    email: userData?.email || ''
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResults(null);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/simulacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error en la simulación');
      setResults(data.result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
 
  const redirectToSolicitud = () => {
    if (typeof onRequestSolicitud === 'function') {
      onRequestSolicitud({ formulario: formData, resultados: results });
    }
  };
 
  return (
    <div className="sim-page">
      <div className="sim-container">
 
        {/* Formulario */}
        <div className="sim-card">
          <button className="back-button" onClick={onBack}>← Volver al inicio</button>
          <h2>Simulador de crédito</h2>
          <p className="sim-subtitle">
            Hola <strong>{userData?.email}</strong>, ingresa los datos para simular tu crédito.
          </p>
 
          {error && <div className="form-error"> {error}</div>}
 
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">RUT</label>
              <input
                name="rut"
                placeholder="12345678-9"
                value={formData.rut}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Edad</label>
              <input
                name="edad"
                type="number"
                placeholder="25"
                value={formData.edad}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Monto necesario <span className="form-hint">(en pesos)</span></label>
              <input
                name="monto"
                type="number"
                placeholder="1.000.000"
                value={formData.monto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Renta mensual <span className="form-hint">(en pesos)</span></label>
              <input
                name="renta"
                type="number"
                placeholder="500.000"
                value={formData.renta}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cantidad de cuotas</label>
              <input
                name="cuotas"
                type="number"
                placeholder="12"
                value={formData.cuotas}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="primary-button full-width" disabled={isLoading}>
              {isLoading ? 'Calculando...' : 'Calcular simulación'}
            </button>
          </form>
        </div>
 
        {/* Resultados */}
        {results && (
          <div className="sim-card results-card">
            <div className="results-header">
              <span className="results-icon"></span>
              <h3>Resultado de tu simulación</h3>
            </div>
 
            <div className="results-highlight">
              <div className="results-highlight-label">Cuota mensual</div>
              <div className="results-highlight-value">
                ${results.valorCuota?.toLocaleString('es-CL')}
              </div>
            </div>
 
            <div className="card-section">
              <div className="field-row">
                <div className="label">Costo total del crédito</div>
                <div className="value">${results.costoTotal?.toLocaleString('es-CL')}</div>
              </div>
              <div className="field-row">
                <div className="label">Tasa de interés mensual</div>
                <div className="value">{results.tasaMensual}%</div>
              </div>
              <div className="field-row">
                <div className="label">Carga Anual Equivalente (CAE)</div>
                <div className="value">{results.cae}%</div>
              </div>
            </div>
 
            <p className="results-disclaimer">
              * Cálculo referencial, no constituye una oferta formal de crédito.
            </p>
 
            <button
              type="button"
              className="primary-button full-width"
              onClick={redirectToSolicitud}
            >
              Solicitar este crédito →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}