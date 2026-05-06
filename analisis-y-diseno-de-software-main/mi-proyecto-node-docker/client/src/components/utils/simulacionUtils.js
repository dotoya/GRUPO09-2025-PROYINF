// Cambiar a false para volver al comportamiento original (escalones fijos como la API)
const SUAVIZADO_ACTIVO = false;

// Criterio adicional: si cargaRenta supera este valor, probabilidad = 0 inmediatamente
// La API no contempla casos extremos, este flag los cubre
// Valor sugerido: 10x (monto es 10 veces la renta mensual)
const TECHO_CARGA_RENTA_ACTIVO = false;
const TECHO_CARGA_RENTA = 10;

export function calcularProbabilidadSimulacion({ edad, monto, renta, cuotas }) {
  const edadNum = parseInt(edad, 10);
  const montoNum = parseFloat(monto);
  const rentaNum = parseFloat(renta);
  const cuotasNum = parseInt(cuotas, 10);

  if (!edadNum || !montoNum || !rentaNum || !cuotasNum) return null;
  if (edadNum < 18) return null;

  const cargaRenta = montoNum / rentaNum;

  // Si la carga es absurda, retornar 0% directamente con el factor marcado como malo
  if (TECHO_CARGA_RENTA_ACTIVO && cargaRenta > TECHO_CARGA_RENTA) {
    return {
      probabilidad: 0,
      factores: [
        {
          nombre: `Edad (${edadNum} años)`,
          estado: (edadNum < 25 || edadNum > 60) ? 'warn' : 'ok',
          etiqueta: (edadNum < 25 || edadNum > 60) ? 'Moderado' : 'Favorable',
        },
        {
          nombre: `Monto vs renta (${cargaRenta.toFixed(1)}x)`,
          estado: 'bad',
          etiqueta: 'Desfavorable',
        },
        {
          nombre: `Plazo (${cuotasNum} cuotas)`,
          estado: cuotasNum > 36 ? 'bad' : cuotasNum > 12 ? 'warn' : 'ok',
          etiqueta: cuotasNum > 36 ? 'Desfavorable' : cuotasNum > 12 ? 'Moderado' : 'Favorable',
        },
      ],
    };
  }

  let factorRiesgoRenta;
  if (SUAVIZADO_ACTIVO) {
    if (cargaRenta > 5) {
      factorRiesgoRenta = 1.5;
    } else if (cargaRenta > 2) {
      const t = (cargaRenta - 2) / (5 - 2);
      factorRiesgoRenta = 1.2 + t * (1.5 - 1.2);
    } else {
      factorRiesgoRenta = 1.0;
    }
  } else {
    if (cargaRenta > 5) factorRiesgoRenta = 1.5;
    else if (cargaRenta > 2) factorRiesgoRenta = 1.2;
    else factorRiesgoRenta = 1.0;
  }

  let factorRiesgoPlazo;
  if (SUAVIZADO_ACTIVO) {
    if (cuotasNum > 36) {
      factorRiesgoPlazo = 1.4;
    } else if (cuotasNum > 12) {
      const t = (cuotasNum - 12) / (36 - 12);
      factorRiesgoPlazo = 1.15 + t * (1.4 - 1.15);
    } else {
      factorRiesgoPlazo = 1.0;
    }
  } else {
    if (cuotasNum > 36) factorRiesgoPlazo = 1.4;
    else if (cuotasNum > 12) factorRiesgoPlazo = 1.15;
    else factorRiesgoPlazo = 1.0;
  }

  let factorRiesgoEdad = 1.0;
  if (edadNum < 25 || edadNum > 60) factorRiesgoEdad = 1.1;

  const riesgoTotal = factorRiesgoRenta * factorRiesgoPlazo * factorRiesgoEdad;
  const riesgoMax = 1.5 * 1.4 * 1.1;
  const probabilidad = Math.max(0, Math.min(100,
    Math.round(100 - ((riesgoTotal - 1.0) / (riesgoMax - 1.0)) * 100)
  ));

  const factores = [
    {
      nombre: `Edad (${edadNum} años)`,
      estado: factorRiesgoEdad === 1.0 ? 'ok' : 'warn',
      etiqueta: factorRiesgoEdad === 1.0 ? 'Favorable' : 'Moderado',
    },
    {
      nombre: `Monto vs renta (${cargaRenta.toFixed(1)}x)`,
      estado: factorRiesgoRenta === 1.0 ? 'ok' : factorRiesgoRenta >= 1.5 ? 'bad' : 'warn',
      etiqueta: factorRiesgoRenta === 1.0 ? 'Favorable' : factorRiesgoRenta >= 1.5 ? 'Desfavorable' : 'Moderado',
    },
    {
      nombre: `Plazo (${cuotasNum} cuotas)`,
      estado: factorRiesgoPlazo === 1.0 ? 'ok' : factorRiesgoPlazo >= 1.4 ? 'bad' : 'warn',
      etiqueta: factorRiesgoPlazo === 1.0 ? 'Favorable' : factorRiesgoPlazo >= 1.4 ? 'Desfavorable' : 'Moderado',
    },
  ];

  return { probabilidad, factores };
}