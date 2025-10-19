import React from 'react';

export default function Simulacion({ onBack }) {
  return (
    <div className="App">
      <button className="back-button" onClick={onBack}>&larr; Volver</button>
      <div className="sim-wrap">
        <form className="sim-card">
          <h2>Simulador de crédito</h2>
          <label>
            RUT
            <input placeholder="12345678-9" required />
          </label>
          <label>
            Monto necesario
            <input type="number" placeholder="1000000" required />
          </label>
          <label>
            Renta mensual
            <input type="number" placeholder="500000" required />
          </label>
          <label>
            Cantidad de cuotas
            <input type="number" placeholder="12" required />
          </label>
          <button type="submit">Iniciar simulación</button>
        </form>
      </div>
    </div>
  );
}
