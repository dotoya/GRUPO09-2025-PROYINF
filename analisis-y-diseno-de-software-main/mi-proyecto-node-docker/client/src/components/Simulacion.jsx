import React, { useState } from 'react';
import './Simulacion.css';
// import { calcularProbabilidadSimulacion } from './utils/simulacionUtils.js';
import {calcularProbabilidadSuavizada} from './utils/simulacionSuavizadaUtils.js'

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
  const [prediccion, setPrediccion] = useState(null);

  const handleChange = (e) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    setPrediccion(calcularProbabilidadSuavizada(newData));
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

        {/* Card del medidor - siempre visible, FUERA del form */}
        <div className="sim-card meter-card">
          <h3 className="meter-title">Probabilidad de aprobación</h3>

          {prediccion === null ? (
            <div className="meter-empty">
              <div className="meter-empty-circle" />
              <div className="meter-empty-lines">
                <div className="meter-empty-line" style={{ width: '60%' }} />
                <div className="meter-empty-line" style={{ width: '40%' }} />
              </div>
              <div className="meter-empty-bar" />
              <p className="meter-empty-text">
                Completa los datos del formulario para ver la estimación
              </p>
            </div>
          ) : (
            <div className="meter-active">
              <div className="meter-pct-row">
                <span className="meter-pct-num" style={{
                  color: prediccion.probabilidad >= 70 ? '#1D9E75'
                       : prediccion.probabilidad >= 40 ? '#EF9F27'
                       : '#E24B4A'
                }}>
                  {prediccion.probabilidad}
                </span>
                <span className="meter-pct-sym" style={{
                  color: prediccion.probabilidad >= 70 ? '#1D9E75'
                       : prediccion.probabilidad >= 40 ? '#EF9F27'
                       : '#E24B4A'
                }}>%</span>
              </div>

              <p className="meter-pct-desc">
                {prediccion.probabilidad >= 70 ? 'Alta probabilidad de aprobación'
                  : prediccion.probabilidad >= 40 ? 'Probabilidad moderada'
                  : 'Baja probabilidad de aprobación'}
              </p>

              <div className="meter-bar-bg">
                <div className="meter-bar-fill" style={{
                  width: `${prediccion.probabilidad}%`,
                  background: prediccion.probabilidad >= 70 ? '#1D9E75'
                            : prediccion.probabilidad >= 40 ? '#EF9F27'
                            : '#E24B4A'
                }} />
              </div>

              <hr className="meter-divider" />

              <div className="meter-factors">
                {prediccion.factores.map((f) => (
                  <div className="meter-factor-row" key={f.nombre}>
                    <span className="meter-factor-name">{f.nombre}</span>
                    <span className={`meter-badge meter-badge-${f.estado}`}>{f.etiqueta}</span>
                  </div>
                ))}
              </div>

              <p className="meter-disclaimer">
                Estimación referencial. No constituye aprobación formal.
              </p>
            </div>
          )}
        </div>

        {/* Formulario */}
        <div className="sim-card">
          <button className="back-button" onClick={onBack}>← Volver al inicio</button>
          <h2>Simulador de crédito</h2>
          <p className="sim-subtitle">
            Hola <strong>{userData?.email}</strong>, ingresa los datos para simular tu crédito.
          </p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">RUT</label>
              <input name="rut" placeholder="12345678-9" value={formData.rut} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Edad</label>
              <input name="edad" type="number" placeholder="25" value={formData.edad} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Monto necesario <span className="form-hint">(en pesos)</span></label>
              <input name="monto" type="number" placeholder="1.000.000" value={formData.monto} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Renta mensual <span className="form-hint">(en pesos)</span></label>
              <input name="renta" type="number" placeholder="500.000" value={formData.renta} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Cantidad de cuotas</label>
              <input name="cuotas" type="number" placeholder="12" value={formData.cuotas} onChange={handleChange} required />
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
            <button type="button" className="primary-button full-width" onClick={redirectToSolicitud}>
              Solicitar este crédito →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}