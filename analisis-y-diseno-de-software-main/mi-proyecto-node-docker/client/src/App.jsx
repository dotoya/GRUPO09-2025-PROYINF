import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import ClientPortal from './components/ClientPortal';
import Simulacion from './components/Simulacion';
import Solicitud from './components/Solicitud';
import Foto from './components/Foto';
import DetallesSimulacion from './components/DetallesSimulacion';
import CreditApplicationPage from './features/credit-application/CreditApplicationPage';

// Separamos el contenido en este componente para poder usar el hook useNavigate
function AppContent() {
  const navigate = useNavigate();
  
  // Mantenemos tus estados de datos intactos
  const [userData, setUserData] = useState(null);
  const [simulacionData, setSimulacionData] = useState(null);
  const [solicitudData, setSolicitudData] = useState(null);
  const [fotoCarnetFile, setFotoCarnetFile] = useState(null);
  const [verificacionResult, setVerificacionResult] = useState(null);

  const handleAuthSuccess = (data) => { 
    setUserData(data); 
    navigate('/simulacion'); 
  };

  const handleLogout = () => {
    setUserData(null);
    navigate('/');
  };

  // El bloque del Home se mantiene igual, pero usando navigate()
  const Home = () => (
    <div className="bank-home">
      <section className="hero">
        <div className="hero-content">
          <h1>Tu crédito,<br />a tu medida</h1>
          <p className="hero-tagline">Simula, solicita y gestiona tu crédito de forma simple y segura. Banco La Polar te acompaña en cada paso.</p>
          <div className="cta">
            <button className="primary" onClick={() => navigate('/login')}>Simular mi crédito</button>
            <button className="secondary" onClick={() => navigate('/register')}>Crear cuenta</button>
          </div>
        </div>
      </section>
      <div className="trust-strip">
        <div className="trust-item"><div className="trust-number">+50K</div><div className="trust-label">Clientes activos</div></div>
        <div className="trust-item"><div className="trust-number">24/7</div><div className="trust-label">Disponibilidad</div></div>
        <div className="trust-item"><div className="trust-number">100%</div><div className="trust-label">Seguro y regulado</div></div>
        <div className="trust-item"><div className="trust-number">3 min</div><div className="trust-label">Para simular</div></div>
      </div>
      <section className="features-section">
        <h2 className="features-title">¿Por qué Banco La Polar?</h2>
        <div className="features">
          <div className="feature"><span className="feature-icon">⚡</span><h3>Simulación instantánea</h3><p>Calcula tu cuota en segundos sin comprometerte a nada.</p></div>
          <div className="feature"><span className="feature-icon">🔒</span><h3>100% seguro</h3><p>Tus datos protegidos con cifrado de nivel bancario.</p></div>
          <div className="feature"><span className="feature-icon">📋</span><h3>Proceso simple</h3><p>Solicita tu crédito en pocos pasos, sin papeleo innecesario.</p></div>
        </div>
      </section>
    </div>
  );

  return (
    <div id="app-root">
      <header className="home-header">
        {/* Usamos Link para el logo, así vuelve al inicio al hacer clic */}
        <Link to="/" className="home-header-logo" style={{textDecoration: 'none', color: 'inherit'}}>
          🏦 Banco La Polar
        </Link>
        <nav className="home-header-nav">
          {userData ? (
            <>
              <span className="header-email">{userData.email}</span>
              <button className="link-button" onClick={() => navigate('/portal')}>Mi Portal</button>
              <button className="link-button" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <button className="link-button" onClick={() => navigate('/login')}>Iniciar sesión</button>
              <button className="link-button" onClick={() => navigate('/register')}>Crear cuenta</button>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={
            <Login 
              onSuccess={handleAuthSuccess} 
              onCreateAccount={() => navigate('/register')} 
            />
          } />
          
          <Route path="/register" element={
            <Register 
              onBackToLogin={() => navigate('/login')} 
              onRegisterSuccess={() => navigate('/login')} 
            />
          } />

          {/* Rutas Protegidas: Si no hay datos, redirigen usando <Navigate replace /> */}
          <Route path="/simulacion" element={
            userData ? (
              <Simulacion 
                userData={userData} 
                onBack={() => navigate('/')} 
                onRequestSolicitud={(simData) => { 
                  setSimulacionData(simData); 
                  navigate('/solicitud'); 
                }} 
              />
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/solicitud" element={
            (simulacionData && userData) ? (
              <Solicitud 
                userData={userData} 
                simulacionData={simulacionData} 
                onBack={() => navigate('/simulacion')} 
                onConfirmar={(formData, fotoCarnet) => { 
                  setSolicitudData(formData); 
                  setFotoCarnetFile(fotoCarnet); 
                  navigate('/foto'); 
                }} 
              />
            ) : <Navigate to="/simulacion" replace />
          } />

          <Route path="/foto" element={
            (solicitudData && userData && fotoCarnetFile) ? (
              <Foto 
                userData={userData} 
                solicitudData={solicitudData} 
                fotoCarnet={fotoCarnetFile} 
                onBack={() => navigate('/solicitud')} 
                onSuccess={(result) => { 
                  setVerificacionResult(result || null); 
                  navigate('/detalles'); 
                }} 
              />
            ) : <Navigate to="/solicitud" replace />
          } />

          <Route path="/portal" element={
            userData ? (
              <ClientPortal 
                userData={userData} 
                onGoHome={() => navigate('/')} 
                onLogout={handleLogout} 
              />
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/detalles" element={
            userData ? (
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
                  navigate('/portal'); 
                }} 
                onBackToHome={() => navigate('/')} 
              />
            ) : <Navigate to="/login" replace />
          } />
          
          <Route path="/credit-application" element={<CreditApplicationPage />}></Route>

          {/* Ruta por defecto (Catch-all) en caso de que escriban una URL que no existe */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="home-footer">
        <p>Banco La Polar</p>
        <small>© {new Date().getFullYear()} Todos los derechos reservados · soporte@lapolar.bank · +56 2 1234 5678</small>
      </footer>
    </div>
  );
}

// App es ahora solo el contenedor que provee el contexto del Router
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;