// Archivo: client/src/components/Simulador.jsx

import React, { useState } from 'react';

// Estado inicial para el formulario y los resultados
const initialState = { rut: '', edad: '', monto: '', renta: '', cuotas: '' };
const initialResults = null;

export default function Simulador({ userData, onBack, onRequestSolicitud }) {
  const [formData, setFormData] = useState({
    ...initialState,
    rut: userData?.rut || '',
    email: userData?.email || ''
  });
  const [results, setResults] = useState(initialResults);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch('http://localhost:3001/api/simulacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error en la simulación desde el servidor');
      }

      setResults(data.result);

    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToSolicitud = () => {
    // Pasar tanto los datos del formulario como los resultados a la página de solicitud
    const simulacionData = {
      formulario: formData,
      resultados: results
    };
    if (typeof onRequestSolicitud === 'function') {
      onRequestSolicitud(simulacionData);
      return;
    }
  };

  return (
    <div className="App">
      <button className="back-button" onClick={onBack}>&larr; Volver</button>
      <div className="sim-wrap">
        <form className="sim-card" onSubmit={handleSubmit}>
          <h2>Simulador de crédito</h2>
          <label>
            RUT
            <input name="rut" placeholder="12345678-9" value={formData.rut} onChange={handleChange} required />
          </label>
          <label>
            Edad
            <input name="edad" type="number" placeholder="18" value={formData.edad} onChange={handleChange} required />
          </label>
          <label>
            Monto necesario
            <input name="monto" type="number" placeholder="1000000" value={formData.monto} onChange={handleChange} required />
          </label>
          <label>
            Renta mensual
            <input name="renta" type="number" placeholder="500000" value={formData.renta} onChange={handleChange} required />
          </label>
          <label>
            Cantidad de cuotas
            <input name="cuotas" type="number" placeholder="12" value={formData.cuotas} onChange={handleChange} required />
          </label>
          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? 'Calculando...' : 'Iniciar simulación'}
          </button>
        </form>

        {/* --- SECCIÓN DE RESULTADOS MEJORADA --- */}
        {results && (
          <div className="sim-card results-card">
            <h3>Resultado de tu Simulación</h3>
            <div className="card-section">
              <div className="field-row"><div className="label">Valor cuota mensual</div><div className="value">${results.valorCuota?.toLocaleString('es-CL')}</div></div>
              <div className="field-row"><div className="label">Costo Total del Crédito</div><div className="value">${results.costoTotal?.toLocaleString('es-CL')}</div></div>
              <div className="field-row"><div className="label">Tasa de Interés Mensual Aplicada</div><div className="value">{results.tasaMensual}%</div></div>
              <div className="field-row"><div className="label">Carga Anual Equivalente (CAE)</div><div className="value">{results.cae}%</div></div>
            </div>
            <small>Este es un cálculo referencial y no constituye una oferta.</small>
            <div className="card-actions center" style={{ marginTop: '12px' }}>
              <button
                type="button"
                className="primary-button"
                onClick={redirectToSolicitud}
              >
                Solicitar crédito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}