import React, { useState } from 'react';

export default function Simulacion({ onBack }) {
  const [rut, setRut] = useState('');
  const [edad, setEdad] = useState('');
  const [monto, setMonto] = useState('');
  const [renta, setRenta] = useState('');
  const [cuotas, setCuotas] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rutRegex = /^[0-9]+-[0-9kK]$/;
      if (!rutRegex.test(rut)) throw new Error('RUT inválido (sin puntos, con guion).');
      if (!edad || Number(edad) < 18) throw new Error('Edad inválida (>=18).');
      if (!monto || Number(monto) <= 0) throw new Error('Monto inválido.');
      if (!renta || Number(renta) <= 0) throw new Error('Renta inválida.');
      if (!cuotas || Number(cuotas) <= 0) throw new Error('Cantidad de cuotas inválida.');

      const response = await fetch('http://localhost:3001/api/simulacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, edad, monto, renta, cuotas }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error en simulación');
      setResult(data.result);
    } catch (err) {
      alert(`Error: ${err.message}`);
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
            <input placeholder="12345678-9" value={rut} onChange={(e) => setRut(e.target.value)} required />
          </label>
          <label>
            Edad
            <input type="number" placeholder="18" value={edad} onChange={(e) => setEdad(e.target.value)} required />
          </label>
          <label>
            Monto necesario
            <input type="number" placeholder="1000000" value={monto} onChange={(e) => setMonto(e.target.value)} required />
          </label>
          <label>
            Renta mensual
            <input type="number" placeholder="500000" value={renta} onChange={(e) => setRenta(e.target.value)} required />
          </label>
          <label>
            Cantidad de cuotas
            <input type="number" placeholder="12" value={cuotas} onChange={(e) => setCuotas(e.target.value)} required />
          </label>
          <button type="submit">Iniciar simulación</button>
        </form>
        {result && (
          <div className="sim-result">
            <h3>Resultado</h3>
            <p>Cuota mensual: {result.cuotaMensual}</p>
            <p>Monto solicitado: {result.montoSolicitado}</p>
            <p>Cuotas: {result.cuotas}</p>
          </div>
        )}
      </div>
    </div>
  );
}
