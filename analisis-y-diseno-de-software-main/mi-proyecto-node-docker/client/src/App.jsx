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
        <h1>Banco al Polar</h1>
        <p>Donde somos tu mayor apoyo.</p>
        <div className="cta">
          <button onClick={() => setView('login')} className="primary">Iniciar Sesión</button>
          <button onClick={() => setView('register')} className="secondary">Registrar</button>
          <button onClick={() => setView('simulacion')} className="secondary">Simulación</button>
        </div>
      </header>

      <section className="features">
        <div className="feature">
          <h3>Prestamo</h3>
          <p>Prestamos sencillos y seguros.</p>
        </div>
        <div className="feature">
          <h3>Pagos</h3>
          <p>Formas de pago justas y con recordatorios apropiados.</p>
        </div>
        <div className="feature">
          <h3>Ayuda al cliente</h3>
          <p>Porque sabemos los confuso que puede ser hacer un prestamo.</p>
        </div>
      </section>
    </div>
  );
}

export default App;