// Archivo: client/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import ClientPortal from './components/ClientPortal';
import Simulacion from './components/Simulacion';
import Solicitud from './components/Solicitud';
import Foto from './components/Foto';
import DetallesSimulacion from './components/DetallesSimulacion';

function App() {
  const [view, setView] = useState('home');
  const [userData, setUserData] = useState(null);
  const [simulacionData, setSimulacionData] = useState(null);
  const [solicitudData, setSolicitudData] = useState(null);
  const [fotoCarnetFile, setFotoCarnetFile] = useState(null);
  const [verificacionResult, setVerificacionResult] = useState(null);

  useEffect(() => {
    console.log(`Vista actual: ${view}`);
  }, [view]);

  const handleAuthSuccess = (data) => {
    setUserData(data);
    setView('simulacion');
  };

  // --- VISTAS DEL FLUJO DE CRÉDITO ---
  
  if (view === 'login') {
    return (
      <Login
        onSuccess={handleAuthSuccess}
        onCreateAccount={() => setView('register')}
      />
    );
  }

  if (view === 'register') {
    return (
      <Register
        onBackToLogin={() => setView('login')}
        onRegisterSuccess={() => setView('login')}
      />
    );
  }

  if (view === 'simulacion') {
    if (!userData) {
      // Redirigir si no hay datos de usuario
      return <div className="bank-home">Redirigiendo a Login...</div>;
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
    if (!simulacionData || !userData) {
      // Redirigir si faltan datos
      return <div className="bank-home">Redirigiendo a Simulación...</div>;
    }
    return (
      <Solicitud
        userData={userData}
        simulacionData={simulacionData}
        onBack={() => setView('simulacion')}
        onConfirmar={(formData, fotoCarnet) => {
          setSolicitudData(formData);
          setFotoCarnetFile(fotoCarnet);
          setView('foto');
        }}
      />
    );
  }

  if (view === 'foto') {
    if (!solicitudData || !userData || !fotoCarnetFile) {
      // Redirigir si faltan datos
      return <div className="bank-home">Redirigiendo a Solicitud...</div>;
    }
    return (
      <Foto
        userData={userData}
        solicitudData={solicitudData}
        fotoCarnet={fotoCarnetFile}
        onBack={() => setView('solicitud')}
        onSuccess={(result) => {
          setVerificacionResult(result || null);
          setView('detalles');
        }}
      />
    );
  }

  if (view === 'portal') {
    return (
      <ClientPortal
        userData={userData}
        onGoHome={() => setView('home')}
        onLogout={() => {
          setUserData(null);
          setView('home');
        }}
      />
    );
  }

  if (view === 'detalles') {
    return (
      <DetallesSimulacion
        userData={userData}
        simulacionData={simulacionData}
        solicitudData={solicitudData}
        verificacionResult={verificacionResult}
        onBackToPortal={() => {
          setSimulacionData(null);
          setSolicitudData(null);
          setFotoCarnetFile(null);
          setVerificacionResult(null);
          setView('portal');
        }}
        onBackToHome={() => setView('home')}
      />
    );
  }

  // --- VISTA HOME ADAPTADA (Página Principal) ---
  return (
    <div className="bank-home">
      
      {/* HEADER */}
      <header className="home-header">
        <div className="home-header-logo">
            Banco La Polar 🏦
        </div>
        <nav className="home-header-nav">
            {userData ? (
                // Botón Portal como secundario (contorno)
                <button className="cta secondary" onClick={() => setView('portal')} style={{ marginRight: '10px' }}>
                    Ir a mi Portal
                </button>
            ) : (
                // Botón Iniciar Sesión como secundario (contorno)
                <button className="cta secondary" onClick={() => setView('login')} style={{ marginRight: '10px' }}>
                    Iniciar Sesión
                </button>
            )}
            
            {/* Botón Registrarse como primario (relleno) */}
            <button className="cta primary" onClick={() => setView('register')}>
                Registrarse
            </button>
        </nav>
      </header>
      
      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-content">
            <h1 style={{ fontSize: '2.5rem', marginTop: '0' }}>Te apoyamos en las buenas y en las malas</h1>
            <p style={{ fontSize: '1.2rem' }}>
              Simula tu crédito en segundos y obtén la aprobación instantánea que necesitas.
            </p>
            
            <div className="cta" style={{ marginTop: '2rem' }}>
              <button className="primary" onClick={() => setView('login')}>
                Simular Crédito y Solicitar Ahora
              </button>
            </div>
            <p className="hero-tagline">
              Sin compromiso • 100% seguro • Respuesta inmediata
            </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="home-footer">
        <p>© 2025 Banco La Polar. Todos los derechos reservados.</p>
        <p>
          <button className="link-button" onClick={() => setView('home')}>Términos y Condiciones</button>
        </p>
      </footer>
      
    </div>
  );
}

export default App;