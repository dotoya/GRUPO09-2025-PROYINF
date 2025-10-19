// Archivo: client/src/components/Simulador.jsx

import React, { useState } from 'react';

// Estado inicial para el formulario y los resultados
const initialState = { rut: '', edad: '', monto: '', renta: '', cuotas: '' };
const initialResults = null;

export default function Simulador({ onBack }) { // Asegurándonos de que reciba onBack
  const [formData, setFormData] = useState(initialState);
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Calculando...' : 'Iniciar simulación'}
          </button>
        </form>

        {/* --- SECCIÓN DE RESULTADOS MEJORADA --- */}
        {results && (
          <div className="sim-card results-card">
            <h3>Resultado de tu Simulación</h3>
            <p><strong>Valor Cuota Mensual:</strong> ${results.valorCuota?.toLocaleString('es-CL')}</p>
            <p><strong>Costo Total del Crédito:</strong> ${results.costoTotal?.toLocaleString('es-CL')}</p>
            <p><strong>Tasa de Interés Mensual Aplicada:</strong> {results.tasaMensual}%</p>
            <p><strong>Carga Anual Equivalente (CAE):</strong> {results.cae}%</p>
            <small>Este es un cálculo referencial y no constituye una oferta.</small>
          </div>
        )}
      </div>
    </div>
  );
}