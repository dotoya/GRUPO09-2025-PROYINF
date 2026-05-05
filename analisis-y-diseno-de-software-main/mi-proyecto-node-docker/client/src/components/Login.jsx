import React, { useState } from 'react';
 
export default function Login({ onSuccess, onCreateAccount }) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error en login');
      localStorage.setItem('token', data.token);
      const userData = { email: loginEmail, token: data.token, ...data.user };
      if (onSuccess) onSuccess(userData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="auth-page">
      <div className="auth-page-brand" onClick={() => window.location.reload()}>
        🏦 Banco La Polar
      </div>
 
      <div className="auth-card">
        <div className="auth-card-header">
          <h2>Bienvenido de vuelta</h2>
          <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>
        </div>
 
        {error && <div className="form-error">⚠️ {error}</div>}
 
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              placeholder="tucorreo@email.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="primary-button full-width" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
 
        <p className="auth-footer-text">
          ¿No tienes cuenta?{' '}
          <button className="link-button-inline" onClick={onCreateAccount}>
            Crear cuenta gratis
          </button>
        </p>
      </div>
    </div>
  );
}