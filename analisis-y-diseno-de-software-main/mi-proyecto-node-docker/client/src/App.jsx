// Archivo: client/src/App.jsx

import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
// --- 1. IMPORTAMOS LA NUEVA VISTA ---
import ClientPortal from './components/ClientPortal';
import Simulacion from './components/Simulacion';

function App() {
  const [view, setView] = useState('home'); // 'home' | 'login' | 'register' | 'portal'

  const handleAuthSuccess = () => {
    // --- 2. ESTE ES EL CAMBIO PRINCIPAL ---
    // En lugar de mostrar una alerta y volver a 'home', ahora te llevamos al portal.
    setView('portal'); 
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
    return <Simulacion onBack={() => setView('home')} />;
  }

  // --- 3. AÑADIMOS LA LÓGICA PARA MOSTRAR LA NUEVA VISTA ---
  if (view === 'portal') {
    return <ClientPortal onGoHome={() => setView('home')} />;
  }

  // Tu página de inicio se queda exactamente igual.
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