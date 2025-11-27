import React from 'react';
import './Login.css';

export default function DetallesSimulacion({ userData, simulacionData, solicitudData, verificacionResult, onBackToPortal, onBackToHome }) {
  const accepted = verificacionResult?.isIdentical === true;
  const confidence = Math.round((verificacionResult?.confidence || 0) * 100);

  return (
    <div className="auth-card">
      <h2>Detalles de la Simulación y Estado de la Solicitud</h2>

      <section style={{ textAlign: 'left', marginTop: 12 }}>
        <h3>Usuario</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(userData, null, 2)}</pre>

        <h3>Datos de la Simulación</h3>
        {simulacionData ? (
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(simulacionData, null, 2)}</pre>
        ) : (
          <p>No hay datos de simulación disponibles.</p>
        )}

        <h3>Datos del Formulario de Solicitud</h3>
        {solicitudData ? (
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(solicitudData, null, 2)}</pre>
        ) : (
          <p>No hay datos de solicitud.</p>
        )}

        <h3>Resultado de Verificación</h3>
        {verificacionResult ? (
          <div>
            <p>
              <strong>Estado:</strong>{' '}
              <span style={{ color: accepted ? 'green' : 'crimson' }}>{accepted ? 'ACEPTADA' : 'RECHAZADA'}</span>
            </p>
            <p><strong>Confianza:</strong> {confidence}%</p>
            <details>
              <summary>Ver JSON completo</summary>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(verificacionResult, null, 2)}</pre>
            </details>
          </div>
        ) : (
          <p>No hay resultado de verificación disponible.</p>
        )}
      </section>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button className="primary-button" onClick={onBackToPortal}>Ir al Portal</button>
        <button onClick={onBackToHome}>Volver al Inicio</button>
      </div>
    </div>
  );
}
