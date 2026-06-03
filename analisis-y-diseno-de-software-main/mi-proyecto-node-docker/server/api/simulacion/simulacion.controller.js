// Archivo: server/api/simulacion/simulacion.controller.js

// Función auxiliar (misma logica de simulacionSuavizadaUtils.js)
const calcularProporcion = (valor, minIn, maxIn, minOut, maxOut) => {
  if (valor <= minIn) return minOut;
  if (valor >= maxIn) return maxOut;
  return ((valor - minIn) * (maxOut - minOut)) / (maxIn - minIn) + minOut;
};

const calcularProbabilidad = (edadNum, montoNum, rentaNum, cuotasNum) => {
  const cargaRenta = montoNum / rentaNum;

  if (cargaRenta > 10) return 0;

  const factorRiesgoRenta = calcularProporcion(cargaRenta, 2, 5, 1.0, 1.5);
  const factorRiesgoPlazo = calcularProporcion(cuotasNum, 12, 36, 1.0, 1.4);

  let factorRiesgoEdad = 1.0;
  if (edadNum < 25) {
    factorRiesgoEdad = calcularProporcion(edadNum, 18, 25, 1.1, 1.0);
  } else if (edadNum > 60) {
    factorRiesgoEdad = calcularProporcion(edadNum, 60, 75, 1.0, 1.1);
  }

  const riesgoTotal = factorRiesgoRenta * factorRiesgoPlazo * factorRiesgoEdad;
  const riesgoMaximoPosible = 1.5 * 1.4 * 1.1;
  const riesgoMinimoPosible = 1.0;

  return Math.max(0, Math.min(100,
    Math.round(100 - ((riesgoTotal - riesgoMinimoPosible) / (riesgoMaximoPosible - riesgoMinimoPosible)) * 100)
  ));
};

exports.simular = async (req, res) => {
  console.log('\n\n--- NUEVA SIMULACIÓN RECIBIDA ---');
  console.log('Datos del Body:', req.body);

  try {
    const { rut, edad } = req.body;
    const monto  = req.body.monto;
    const renta  = req.body.renta  ?? req.body.ingreso_mensual; // dani qlo cambio el nombre de las variables en los test unitarios
    const cuotas = req.body.cuotas ?? req.body.plazo;           // chupalo dani

    // --- VALIDACIÓN (fix test_02) ---
    const edadNum   = parseInt(edad, 10);
    const montoNum  = parseFloat(monto);
    const rentaNum  = parseFloat(renta);
    const cuotasNum = parseInt(cuotas, 10);

    const camposFaltantes =
      monto  === undefined || monto  === null || monto  === '' ||
      renta  === undefined || renta  === null || renta  === '' ||
      cuotas === undefined || cuotas === null || cuotas === '';

    const valoresInvalidos =
      isNaN(montoNum)  || montoNum  <= 0 ||
      isNaN(rentaNum)  || rentaNum  <= 0 ||
      isNaN(cuotasNum) || cuotasNum <= 0 ||
      isNaN(edadNum)   || edadNum   < 18;

    if (camposFaltantes || valoresInvalidos) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'Los campos monto, renta y cuotas son obligatorios y deben ser valores positivos. La edad debe ser mayor o igual a 18.'
      });
    }

    // --- CÁLCULO DE TASA (lógica original) ---
    const tasaBaseMensual = 0.015;
    const cargaRenta = montoNum / rentaNum;

    let factorRiesgoRenta = 1.0;
    if (cargaRenta > 5) factorRiesgoRenta = 1.5;
    else if (cargaRenta > 2) factorRiesgoRenta = 1.2;

    let factorRiesgoPlazo = 1.0;
    if (cuotasNum > 36) factorRiesgoPlazo = 1.4;
    else if (cuotasNum > 12) factorRiesgoPlazo = 1.15;

    let factorRiesgoEdad = 1.0;
    if (edadNum < 25 || edadNum > 60) factorRiesgoEdad = 1.1;

    const tasaInteresMensual = Math.min(
      tasaBaseMensual * factorRiesgoRenta * factorRiesgoPlazo * factorRiesgoEdad,
      0.035
    );

    const valorCuota  = montoNum * (tasaInteresMensual * Math.pow(1 + tasaInteresMensual, cuotasNum)) / (Math.pow(1 + tasaInteresMensual, cuotasNum) - 1);
    const costoTotal  = valorCuota * cuotasNum;
    const caeAproximado = Math.pow(1 + tasaInteresMensual, 12) - 1;

    // --- PROBABILIDAD (fix test_01, portada desde simulacionSuavizadaUtils.js) ---
    const probabilidad = calcularProbabilidad(edadNum, montoNum, rentaNum, cuotasNum);

    const result = {
      valorCuota:      Math.round(valorCuota),
      costoTotal:      Math.round(costoTotal),
      tasaMensual:     (tasaInteresMensual * 100).toFixed(2),
      cae:             (caeAproximado * 100).toFixed(2),
      montoSolicitado: montoNum,
      cuotas:          cuotasNum,
    };

    console.log('--- SIMULACIÓN PROCESADA CON ÉXITO ---');
    return res.status(200).json({
      message:      'Simulación procesada',
      probabilidad, // <-- nuevo campo que esperan los tests
      result,
    });

  } catch (error) {
    console.error('!!! ERROR EN SIMULACIÓN:', error);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};