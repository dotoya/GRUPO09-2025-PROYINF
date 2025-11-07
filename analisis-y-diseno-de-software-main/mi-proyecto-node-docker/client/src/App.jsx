// Archivo: client/src/App.jsx

import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
// --- 1. IMPORTAMOS LA NUEVA VISTA ---
import ClientPortal from './components/ClientPortal';
import Simulacion from './components/Simulacion';
import Solicitud from './components/Solicitud';
import Foto from './components/Foto';

function App() {
  const [view, setView] = useState('home'); // 'home' | 'login' | 'register' | 'portal' | 'foto'
  const [userData, setUserData] = useState(null);
  const [simulacionData, setSimulacionData] = useState(null);
  const [solicitudData, setSolicitudData] = useState(null);

  // Si hay token pero no datos de usuario, redirigir a login
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && (view === 'simulacion' || view === 'solicitud')) {
      setView('login');
    }
  }, [view]);

  const handleAuthSuccess = (data) => {
    // --- 2. REDIRECCIÓN TRAS LOGIN EXITOSO ---
    // Si el inicio de sesión funciona, llevar al usuario a la vista de simulación.
    setUserData(data);
    setView('simulacion');
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
    // Si no hay usuario logueado, redirigir a login
    if (!userData) {
      return <Login onSuccess={handleAuthSuccess} onCreateAccount={() => setView('register')} />;
    }
    return (
      <Simulacion
        userData={userData}
        onBack={() => setView('home')}
        onRequestSolicitud={(simData) => {
          setSimulacionData(simData);
          setView('solicitud');
        }}
      />
    );
  }

  if (view === 'solicitud') {
    // Si no hay datos de simulación o usuario, redirigir a simulación
    if (!simulacionData || !userData) {
      return <Simulacion 
        userData={userData} 
        onBack={() => setView('home')} 
        onRequestSolicitud={(simData) => {
          setSimulacionData(simData);
          setView('solicitud');
        }} 
      />;
    }
    return (
      <Solicitud 
        userData={userData} 
        simulacionData={simulacionData} 
        onBack={() => setView('simulacion')} 
        onConfirmar={(formData) => {
          setSolicitudData(formData);
          setView('foto');
        }}
      />
    );
  }

  if (view === 'foto') {
    // Si no hay datos previos, redirigir a solicitud
    if (!solicitudData || !userData) {
      return <Solicitud 
        userData={userData}
        simulacionData={simulacionData}
        onBack={() => setView('simulacion')}
        onConfirmar={(formData) => {
          setSolicitudData(formData);
          setView('foto');
        }}
      />;
    }
    return (
      <Foto
        userData={userData}
        solicitudData={solicitudData}
        onBack={() => setView('solicitud')}
        onSuccess={() => {
          alert('¡Solicitud enviada con éxito!');
          setView('home');
        }}
      />
    );
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