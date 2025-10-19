import React, { useState } from 'react';

export default function Register({ onSuccess }) {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRut, setRegisterRut] = useState('');
  const [registerBirthdate, setRegisterBirthdate] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Basic client-side validation for RUT: allow numbers then hyphen then digit or K/k (no dots)
      const rutRegex = /^[0-9]+-[0-9kK]$/;
      if (!rutRegex.test(registerRut)) {
        throw new Error('RUT inválido. Debe ser sin puntos y con guion, p.ej. 12345678-9');
      }
      if (!registerBirthdate) {
        throw new Error('Fecha de nacimiento es requerida.');
      }

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          rut: registerRut,
          birthdate: registerBirthdate,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error en registro');
      alert('Registro exitoso');
      if (onSuccess) onSuccess();
    } catch (error) {
      alert(`Error en el registro: ${error.message}`);
    }
  };

  return (
    <div className="auth-card">
      <h2>Registro</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="RUT (sin puntos, con guion)"
          value={registerRut}
          onChange={(e) => setRegisterRut(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Fecha de nacimiento"
          value={registerBirthdate}
          onChange={(e) => setRegisterBirthdate(e.target.value)}
          required
        />
        <button type="submit">Crear cuenta</button>
      </form>
    </div>
  );
}
