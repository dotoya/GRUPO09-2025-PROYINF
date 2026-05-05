// Función auxiliar matemática para evitar los saltos (Interpolación lineal)
// Convierte un valor suavemente de un rango a otro.
const calcularProporcion = (valor, minIn, maxIn, minOut, maxOut) => {
  if (valor <= minIn) return minOut;
  if (valor >= maxIn) return maxOut;
  return ((valor - minIn) * (maxOut - minOut)) / (maxIn - minIn) + minOut;
};

export function calcularProbabilidadSuavizada({ edad, monto, renta, cuotas }) {
  const edadNum = parseInt(edad, 10);
  const montoNum = parseFloat(monto);
  const rentaNum = parseFloat(renta);
  const cuotasNum = parseInt(cuotas, 10);

  // Validaciones iniciales
  if (!edadNum || !montoNum || !rentaNum || !cuotasNum) return null;
  if (edadNum < 18) return null;

  const cargaRenta = montoNum / rentaNum;

  // Filtro de extremo: Si piden 10 veces su sueldo, es un rechazo inmediato
  if (cargaRenta > 10) {
    return {
      probabilidad: 0,
      factores: [
        { nombre: `Edad (${edadNum} años)`, estado: 'ok', etiqueta: 'Favorable' },
        { nombre: `Monto vs renta (${cargaRenta.toFixed(1)}x)`, estado: 'bad', etiqueta: 'Desfavorable' },
        { nombre: `Plazo (${cuotasNum} cuotas)`, estado: 'ok', etiqueta: 'Favorable' }
      ]
    };
  }

  // --- 1. FACTOR RENTA (Sin saltos) ---
  // Menor a 2 = 1.0 | Mayor a 5 = 1.5 | Entre 2 y 5 = sube progresivamente
  const factorRiesgoRenta = calcularProporcion(cargaRenta, 2, 5, 1.0, 1.5);

  // --- 2. FACTOR PLAZO (Sin saltos) ---
  // Menor a 12 = 1.0 | Mayor a 36 = 1.4 | Entre 12 y 36 = sube progresivamente
  const factorRiesgoPlazo = calcularProporcion(cuotasNum, 12, 36, 1.0, 1.4);

  // --- 3. FACTOR EDAD (Sin saltos) ---
  let factorRiesgoEdad = 1.0;
  if (edadNum < 25) {
    // Entre 18 y 25 años, el riesgo baja suavemente de 1.1 a 1.0
    factorRiesgoEdad = calcularProporcion(edadNum, 18, 25, 1.1, 1.0);
  } else if (edadNum > 60) {
    // Entre 60 y 75 años, el riesgo sube suavemente de 1.0 a 1.1
    factorRiesgoEdad = calcularProporcion(edadNum, 60, 75, 1.0, 1.1);
  }

  // --- 4. CÁLCULO FINAL DE PROBABILIDAD ---
  const riesgoTotal = factorRiesgoRenta * factorRiesgoPlazo * factorRiesgoEdad;
  
  const riesgoMaximoPosible = 1.5 * 1.4 * 1.1; // 2.31
  const riesgoMinimoPosible = 1.0;

  // Invertimos el riesgo para que sea porcentaje (100% es riesgo mínimo)
  const probabilidad = Math.max(0, Math.min(100,
    Math.round(100 - ((riesgoTotal - riesgoMinimoPosible) / (riesgoMaximoPosible - riesgoMinimoPosible)) * 100)
  ));

  // --- 5. RESULTADO CON ETIQUETAS ADAPTADAS ---
  const factores = [
    {
      nombre: `Edad (${edadNum} años)`,
      estado: factorRiesgoEdad <= 1.02 ? 'ok' : factorRiesgoEdad >= 1.08 ? 'bad' : 'warn',
      etiqueta: factorRiesgoEdad <= 1.02 ? 'Favorable' : factorRiesgoEdad >= 1.08 ? 'Desfavorable' : 'Moderado',
    },
    {
      nombre: `Monto vs renta (${cargaRenta.toFixed(1)}x)`,
      estado: factorRiesgoRenta <= 1.1 ? 'ok' : factorRiesgoRenta >= 1.4 ? 'bad' : 'warn',
      etiqueta: factorRiesgoRenta <= 1.1 ? 'Favorable' : factorRiesgoRenta >= 1.4 ? 'Desfavorable' : 'Moderado',
    },
    {
      nombre: `Plazo (${cuotasNum} cuotas)`,
      estado: factorRiesgoPlazo <= 1.1 ? 'ok' : factorRiesgoPlazo >= 1.3 ? 'bad' : 'warn',
      etiqueta: factorRiesgoPlazo <= 1.1 ? 'Favorable' : factorRiesgoPlazo >= 1.3 ? 'Desfavorable' : 'Moderado',
    },
  ];

  return { probabilidad, factores };
}