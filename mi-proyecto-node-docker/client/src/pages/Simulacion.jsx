import React, { useState } from 'react'
import './Simulacion.css'

export default function Simulacion(){
  const [rut, setRut] = useState('')
  const [monto, setMonto] = useState('')
  const [renta, setRenta] = useState('')
  const [cuotas, setCuotas] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const handleStart = async (e) => {
    e.preventDefault()
    setError('')
    setOk('')

    if (!rut || !monto || !renta || !cuotas) {
      setError('Por favor completa todos los campos')
      return
    }

    const payload = { rut, monto: Number(monto), renta: Number(renta), cuotas: Number(cuotas) }

    // Guardar en localStorage para uso futuro por el backend o las siguientes pantallas
    try {
      localStorage.setItem('simulation', JSON.stringify(payload))

      // Intentar enviar al backend si está disponible
      try {
        const res = await fetch('/api/simulation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (res.ok) {
          setOk('Simulación iniciada y enviada al servidor')
        } else {
          setOk('Simulación guardada localmente (no se pudo enviar al servidor)')
        }
      } catch (err) {
        setOk('Simulación guardada localmente (no hay conexión al servidor)')
      }
    } catch (err) {
      setError('Error al guardar la simulación')
    }
  }

  return (
    <div className="sim-wrap">
      <form className="sim-card" onSubmit={handleStart}>
        <h2>Simulador de crédito</h2>
        {error && <div className="form-error">{error}</div>}
        {ok && <div className="form-ok">{ok}</div>}

        <label>
          RUT
          <input value={rut} onChange={e=>setRut(e.target.value)} placeholder="12345678-9" required />
        </label>

        <label>
          Monto necesario
          <input type="number" value={monto} onChange={e=>setMonto(e.target.value)} placeholder="1000000" required />
        </label>

        <label>
          Renta mensual
          <input type="number" value={renta} onChange={e=>setRenta(e.target.value)} placeholder="500000" required />
        </label>

        <label>
          Cantidad de cuotas
          <input type="number" value={cuotas} onChange={e=>setCuotas(e.target.value)} placeholder="12" required />
        </label>

        <button type="submit">Iniciar</button>
      </form>
    </div>
  )
}
