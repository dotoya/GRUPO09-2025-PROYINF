
import React, { useState } from 'react';
 
export default function Register({ onBackToLogin, onRegisterSuccess }) {
  const [form, setForm] = useState({ email: '', rut: '', password: '', birthdate: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const rutRegex = /^[0-9]+-[0-9kK]$/;
    if (!rutRegex.test(form.rut)) {
      setError('RUT inválido. Debe ser sin puntos y con guion, ej: 12345678-9');
      return;
    }
    if (!form.birthdate) {
      setError('La fecha de nacimiento es requerida.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error en registro');
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="auth-page">
      <div className="auth-page-brand" onClick={onBackToLogin}>
        🏦 Banco La Polar
      </div>
 
      <div className="auth-card">
        <div className="auth-card-header">
          <h2>Crear cuenta</h2>
          <p className="auth-subtitle">Completa tus datos para registrarte</p>
        </div>
 
        {error && <div className="form-error">⚠️ {error}</div>}
 
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="tucorreo@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">RUT <span className="form-hint">(sin puntos, con guion)</span></label>
            <input
              type="text"
              name="rut"
              placeholder="12345678-9"
              value={form.rut}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              name="birthdate"
              value={form.birthdate}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="primary-button full-width" disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
 
        <p className="auth-footer-text">
          ¿Ya tienes cuenta?{' '}
          <button className="link-button-inline" onClick={onBackToLogin}>
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}