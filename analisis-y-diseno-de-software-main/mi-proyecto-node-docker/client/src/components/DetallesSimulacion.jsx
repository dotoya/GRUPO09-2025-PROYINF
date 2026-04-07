import React, { useState } from 'react';
import '../App.css';

export default function DetallesSimulacion({ userData, simulacionData, solicitudData, verificacionResult, onBackToPortal, onBackToHome }) {
  // Verificación facial
  const faceAccepted = verificacionResult?.isIdentical === true;
  const confidence = Math.round((verificacionResult?.confidence || 0) * 100);

  // Criterio de aprobación: cuota mensual no puede superar el 34% de la renta
  const cuotaRaw = simulacionData?.resultados?.valorCuota ?? simulacionData?.resultados?.valorCuotaMensual ?? 0;
  const cuota = Number(cuotaRaw || 0);
  const rentaRaw = simulacionData?.formulario?.renta ?? userData?.renta ?? 0;
  const renta = Number(rentaRaw || 0);
  const cuotaMax = Math.round(renta * 0.34);
  const affordabilityAccepted = cuota > 0 && renta > 0 ? cuota <= cuotaMax : false;

  // Para permitir firma ambos deben ser true (verificación facial y capacidad de pago)
  const canSign = faceAccepted && affordabilityAccepted;
  const [showModal, setShowModal] = useState(false);
  const [rutInput, setRutInput] = useState('');

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => { setShowModal(false); setRutInput(''); };

  const handleEnviarFirma = (e) => {
    e.preventDefault();
    if (!rutInput || rutInput.trim().length === 0) {
      alert('Por favor ingresa tu RUT antes de enviar.');
      return;
    }

    // Aquí podríamos llamar al backend para registrar la firma/transferencia.
    // Para este requisito pediste mostrar una notificación cuando se envía:
    alert('El monto fue trasferido');
    handleCloseModal();
  };

  return (
    <div className="auth-card large">
      <h2>Detalles de la Simulación y Estado de la Solicitud</h2>

      <section style={{ textAlign: 'left', marginTop: 12 }}>
        {/* Usuario eliminado — sólo se muestran datos relevantes para el usuario final */}

        {/* -- SIMULACIÓN (formulario + resultados) -- */}
        <h3 style={{ marginTop: 14 }}>Datos de la Simulación</h3>
        {simulacionData ? (
          <div className="card-section" style={{ border: '1px solid #eee', padding: 12, borderRadius: 6 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Formulario enviado</strong>
              <div style={{ marginTop: 6 }}>
                <div className="field-row"><div className="label">RUT</div><div className="value">{simulacionData.formulario?.rut || '—'}</div></div>
                <div className="field-row"><div className="label">Edad</div><div className="value">{simulacionData.formulario?.edad || '—'}</div></div>
                <div className="field-row"><div className="label">Monto</div><div className="value">{simulacionData.formulario?.monto ? `$ ${Number(simulacionData.formulario.monto).toLocaleString('es-CL')}` : '—'}</div></div>
                <div className="field-row"><div className="label">Renta</div><div className="value">{simulacionData.formulario?.renta ? `$ ${Number(simulacionData.formulario.renta).toLocaleString('es-CL')}` : '—'}</div></div>
                <div className="field-row"><div className="label">Cuotas</div><div className="value">{simulacionData.formulario?.cuotas || '—'}</div></div>
              </div>
            </div>

            <div>
              <strong>Resultados</strong>
              {simulacionData.resultados ? (
                <div style={{ marginTop: 6 }}>
                  <div className="field-row"><div className="label">Valor cuota mensual</div><div className="value">{simulacionData.resultados.valorCuota ? `$ ${Number(simulacionData.resultados.valorCuota).toLocaleString('es-CL')}` : '—'}</div></div>
                  <div className="field-row"><div className="label">Costo total del crédito</div><div className="value">{simulacionData.resultados.costoTotal ? `$ ${Number(simulacionData.resultados.costoTotal).toLocaleString('es-CL')}` : '—'}</div></div>
                  <div className="field-row"><div className="label">Tasa mensual aplicada</div><div className="value">{simulacionData.resultados.tasaMensual !== undefined ? `${simulacionData.resultados.tasaMensual}%` : '—'}</div></div>
                  <div className="field-row"><div className="label">CAE</div><div className="value">{simulacionData.resultados.cae !== undefined ? `${simulacionData.resultados.cae}%` : '—'}</div></div>
                </div>
              ) : (
                <div style={{ color: '#666', marginTop: 6 }}>No hay resultados calculados.</div>
              )}
            </div>
          </div>
        ) : (
          <p>No hay datos de simulación disponibles.</p>
        )}

        {/* -- DATOS DE LA SOLICITUD -- */}
        <h3 style={{ marginTop: 14 }}>Datos del Formulario de Solicitud</h3>
        {solicitudData ? (
          <div className="card-section" style={{ border: '1px solid #eee', padding: 12, borderRadius: 6 }}>
            <div style={{ color: '#444' }}>
              <div className="field-row"><div className="label">Nombre</div><div className="value">{solicitudData.nombre || solicitudData.form?.nombre || '—'}</div></div>
              <div className="field-row"><div className="label">Apellido</div><div className="value">{solicitudData.apellido || solicitudData.form?.apellido || '—'}</div></div>
              <div className="field-row"><div className="label">RUT</div><div className="value">{solicitudData.rut || solicitudData.form?.rut || '—'}</div></div>
              <div className="field-row"><div className="label">Email</div><div className="value">{solicitudData.email || solicitudData.form?.email || '—'}</div></div>
              <div className="field-row"><div className="label">Teléfono</div><div className="value">{solicitudData.telefono || solicitudData.form?.telefono || '—'}</div></div>
              <div className="field-row"><div className="label">Dirección</div><div className="value">{solicitudData.direccion || solicitudData.form?.direccion || '—'}</div></div>
            </div>
            {solicitudData._previewImage && (
              <div style={{ marginTop: 8 }}>
                <img src={solicitudData._previewImage} alt="Preview carnet" style={{ maxWidth: 200, borderRadius: 6 }} />
              </div>
            )}
          </div>
        ) : (
          <p>No hay datos de solicitud.</p>
        )}

        <h3>Resultado de Verificación</h3>
        {verificacionResult ? (
          <div>
            <p>
              <strong>Verificación facial:</strong>{' '}
              <span style={{ color: faceAccepted ? 'green' : 'crimson' }}>{faceAccepted ? 'ACEPTADA' : 'RECHAZADA'}</span>
            </p>
            <p><strong>Confianza:</strong> {confidence}%</p>

            <p>
              <strong>Aprobación por capacidad de pago (34% de renta):</strong>{' '}
              <span style={{ color: affordabilityAccepted ? 'green' : 'crimson' }}>{affordabilityAccepted ? 'ACEPTADA' : 'RECHAZADA'}</span>
            </p>

            {!affordabilityAccepted && (
              <div style={{ color: '#a00', marginTop: 6 }}>
                <small>La cuota mensual {cuota ? `($ ${cuota.toLocaleString('es-CL')})` : '(sin valor)'} supera el 34% de tu renta. Límite: $ {cuotaMax.toLocaleString('es-CL')}</small>
              </div>
            )}

            {canSign && (
              <div className="card-actions center">
                <button className="primary-button" onClick={handleOpenModal}>Firmar contrato del crédito</button>
              </div>
            )}
            {/* Información técnica eliminada para usuarios finales (no mostrar JSON crudo) */}
          </div>
        ) : (
          <p>No hay resultado de verificación disponible.</p>
        )}
      </section>

      <div className="card-actions center" style={{ marginTop: 16 }}>
        <button className="primary-button" onClick={onBackToPortal}>Ir al Portal</button>
        <button onClick={onBackToHome}>Volver al Inicio</button>
      </div>

      {/* Modal simple en línea para pedir RUT y enviar firma */}
      {showModal && (
        <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 8, width: 360, boxShadow: '0 6px 24px rgba(0,0,0,0.25)' }}>
            <h3>Firmar contrato del crédito</h3>
            <p>Ingresa tu RUT para firmar y confirmar la transferencia del monto.</p>
            <form onSubmit={handleEnviarFirma}>
              <input
                type="text"
                placeholder="Ej: 12345678-9"
                value={rutInput}
                onChange={(e) => setRutInput(e.target.value)}
                style={{ width: '100%', padding: 8, marginBottom: 12, boxSizing: 'border-box' }}
              />
              <div className="card-actions" style={{ marginTop: 6 }}>
                <button type="button" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="primary-button">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
