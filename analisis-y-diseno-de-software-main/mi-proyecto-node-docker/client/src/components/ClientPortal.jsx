// Archivo: client/src/components/ClientPortal.jsx

import React from 'react';

// Esta es la nueva "ventana" a la que serás redirigido.
// Por ahora, solo muestra un mensaje de bienvenida y un botón para volver.
// Más adelante, aquí podrás poner la funcionalidad para pedir créditos.
export default function ClientPortal({ onGoHome }) {
  return (
    <div className="App">
      <div className="card">
        <h2>Portal del Cliente</h2>
        <p>¡Bienvenido! Has iniciado sesión correctamente.</p>
        <p>Desde aquí podrás gestionar tus productos.</p>
        <button className="primary" onClick={onGoHome}>Volver al Inicio</button>
      </div>
    </div>
  );
}