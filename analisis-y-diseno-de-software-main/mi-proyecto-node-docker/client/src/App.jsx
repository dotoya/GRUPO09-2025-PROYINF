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

  // renderiza la vista activa (centralizamos para que header/footer siempre estén presentes)
  const renderView = () => {
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
      if (!userData) return (
        <Login
          onSuccess={handleAuthSuccess}
          onCreateAccount={() => setView('register')}
        />
      );
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
          onSuccess={(result) => {
            // Guardamos el resultado y navegamos a la vista de detalles
            setVerificacionResult(result || null);
            setView('detalles');
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

    // --- VISTA DETALLES DE LA SIMULACIÓN / RESULTADO ---
    if (view === 'detalles') {
      // si faltan datos mínimos, volver a portal o simulacion
      return (
        <DetallesSimulacion
          userData={userData}
          simulacionData={simulacionData}
          solicitudData={solicitudData}
          verificacionResult={verificacionResult}
          onBackToPortal={() => {
            // limpiamos los datos de la solicitud después de mostrar
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

    // --- VISTA HOME ---
    return (
      <div className="App bank-home" style={{ textAlign: 'center', marginTop: '60px' }}>
        <div className="hero">
          <div className="hero-content">
            <h1>Banco La Polar 🏦</h1>
            <p className="hero-tagline">Te apoyamos en las buenas y en las malas — soluciones de crédito claras y seguras para ti.</p>
            <div className="cta" style={{ marginTop: 16 }}>
              <button className="primary" onClick={() => setView('login')}>Iniciar Sesión y empezar simulación</button>
              <button className="secondary" onClick={() => setView('register')} style={{ marginLeft: '10px' }}>
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        onSuccess={(result) => {
          // Guardamos el resultado y navegamos a la vista de detalles
          setVerificacionResult(result || null);
          setView('detalles');
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

  // --- VISTA DETALLES DE LA SIMULACIÓN / RESULTADO ---
  if (view === 'detalles') {
    // si faltan datos mínimos, volver a portal o simulacion
    return (
      <DetallesSimulacion
        userData={userData}
        simulacionData={simulacionData}
        solicitudData={solicitudData}
        verificacionResult={verificacionResult}
        onBackToPortal={() => {
          // limpiamos los datos de la solicitud después de mostrar
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

  // HEADER / MAIN / FOOTER layout, el contenido se delega a renderView()
  return (
    <div id="app-root">
      <header className="home-header">
        <div className="home-header-logo">Banco La Polar</div>
        <div className="home-header-nav">
          {userData ? (
            <>
              <span style={{ marginRight: 12, color: 'var(--muted)', fontSize: '0.95rem' }}>{userData.email}</span>
              <button className="link-button" onClick={() => setView('portal')}>Ir al Portal</button>
              <button className="link-button" onClick={() => { setUserData(null); setView('home'); }}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <button className="link-button" onClick={() => setView('login')}>Iniciar sesión</button>
              <button className="link-button" onClick={() => setView('register')}>Crear cuenta</button>
            </>
          )}
        </div>
      </header>

      <main style={{ minHeight: 'calc(100vh - 180px)', padding: '2rem 1rem' }}>
        {renderView()}
      </main>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Banco La Polar — Todos los derechos reservados.</p>
        <small>Contacto: soporte@lapolar.bank | Tel: +56 2 1234 5678</small>
      </footer>
    </div>
  );
}

export default App;
