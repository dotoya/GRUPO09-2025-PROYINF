// Archivo: client/src/App.jsx

import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [view, setView] = useState('home'); // 'home' | 'login' | 'register'

  const handleAuthSuccess = () => {
    // Simular redirección a panel del usuario tras login/registro
    setView('home');
    alert('Autenticación exitosa. Bienvenido al banco.');
  };

  if (view === 'login') {
    return (
      <div className="App">
        <button className="back-button" onClick={() => setView('home')}>&larr; Volver</button>
        <Login onSuccess={handleAuthSuccess} onCreateAccount={() => setView('register')} />
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className="App">
        <button className="back-button" onClick={() => setView('home')}>&larr; Volver</button>
        <Register onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  if (view === 'simulacion') {
    return (
      <div className="App">
        <button className="back-button" onClick={() => setView('home')}>&larr; Volver</button>
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

  return (
    <div className="App bank-home">
      <header className="hero">
        <img src="/vite.svg" className="logo" alt="logo" />
        <h1>Banco Nuevo Horizonte</h1>
        <p>Tu dinero seguro. Operaciones claras. Atención siempre disponible.</p>
        <div className="cta">
          <button onClick={() => setView('login')} className="primary">Iniciar Sesión</button>
          <button onClick={() => setView('register')} className="secondary">Abrir cuenta</button>
          <button onClick={() => setView('simulacion')} className="secondary">Simulación</button>
        </div>
      </header>

      <section className="features">
        <div className="feature">
          <h3>Cuentas</h3>
          <p>Cuenta corriente y ahorro con beneficios y sin comisiones ocultas.</p>
        </div>
        <div className="feature">
          <h3>Préstamos</h3>
          <p>Préstamos rápidos con tasas competitivas y plazos flexibles.</p>
        </div>
        <div className="feature">
          <h3>Soporte 24/7</h3>
          <p>Asistencia por chat y teléfono, siempre que la necesites.</p>
        </div>
      </section>
    </div>
  );
}

export default App;