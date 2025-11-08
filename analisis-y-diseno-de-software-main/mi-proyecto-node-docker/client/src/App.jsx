// Archivo: client/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import ClientPortal from './components/ClientPortal';
import Simulacion from './components/Simulacion';
import Solicitud from './components/Solicitud';
import Foto from './components/Foto';

function App() {
  const [view, setView] = useState('home');
  const [userData, setUserData] = useState(null);
  const [simulacionData, setSimulacionData] = useState(null);
  const [solicitudData, setSolicitudData] = useState(null);
  const [fotoCarnetFile, setFotoCarnetFile] = useState(null);

  useEffect(() => {
    console.log(`Vista actual: ${view}`);
  }, [view]);

  const handleAuthSuccess = (data) => {
    setUserData(data);
    setView('simulacion');
  };

  // --- VISTA LOGIN ---
  if (view === 'login') {
    return (
      <Login
        onSuccess={handleAuthSuccess}
        onCreateAccount={() => setView('register')}
      />
    );
  }

  // --- VISTA REGISTER ---
  if (view === 'register') {
    return (
      <Register
        onBackToLogin={() => setView('login')}
        onRegisterSuccess={() => setView('login')}
      />
    );
  }

  // --- VISTA SIMULACIÓN ---
  if (view === 'simulacion') {
    if (!userData) {
      return (
        <Login
          onSuccess={handleAuthSuccess}
          onCreateAccount={() => setView('register')}
        />
      );
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

  // --- VISTA SOLICITUD ---
  if (view === 'solicitud') {
    if (!simulacionData || !userData) {
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

  // --- VISTA FOTO ---
  if (view === 'foto') {
    if (!solicitudData || !userData || !fotoCarnetFile) {
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
    return (
      <Foto
        userData={userData}
        solicitudData={solicitudData}
        fotoCarnet={fotoCarnetFile}
        onBack={() => setView('solicitud')}
        onSuccess={() => {
          alert('¡Verificación Exitosa! Solicitud enviada.');
          setSimulacionData(null);
          setSolicitudData(null);
          setFotoCarnetFile(null);
          setView('portal');
        }}
      />
    );
  }

  // --- VISTA PORTAL DEL CLIENTE ---
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

  // --- VISTA HOME ---
  return (
    <div className="App bank-home" style={{ textAlign: 'center', marginTop: '60px' }}>
      <h1>Banco La Polar 🏦</h1>
      <p>Te apoyamos en las buenas y en las malas.</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setView('login')}>Iniciar Sesión y empezar simulación</button>
        <button onClick={() => setView('register')} style={{ marginLeft: '10px' }}>
          Registrarse
        </button>
      </div>
    </div>
  );
}

export default App;
