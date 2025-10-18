import React, { useState } from 'react';
import './Login.css';

export default function Login({ onSuccess, onCreateAccount }) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error en login');
      // En un caso real, guardar token en localStorage o contexto
      localStorage.setItem('token', data.token);
      if (onSuccess) onSuccess();
    } catch (error) {
      alert(`Error en el login: ${error.message}`);
    }
  };

  return (
    <div className="auth-card">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      <p style={{ marginTop: '0.75rem' }}>
        ¿No tienes cuenta? <button className="link-button" onClick={onCreateAccount}>crear cuenta</button>
      </p>
    </div>
  );
}
