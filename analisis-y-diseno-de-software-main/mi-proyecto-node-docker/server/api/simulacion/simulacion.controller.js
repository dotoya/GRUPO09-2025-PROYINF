// Archivo: server/api/simulacion/simulacion.controller.js

exports.simular = async (req, res) => {
    // --- PASO 1: Ver si la petición llega y qué datos trae ---
    console.log('\n\n--- NUEVA SIMULACIÓN RECIBIDA ---');
    console.log('Datos del Body:', req.body);

    try {
        const { rut, edad, monto, renta, cuotas } = req.body;
        const edadNum = parseInt(edad, 10);
        const montoNum = parseFloat(monto);
        const rentaNum = parseFloat(renta);
        const cuotasNum = parseInt(cuotas, 10);

        // --- PASO 2: Ver si los números se están interpretando correctamente ---
        console.log(`Valores numéricos: Monto=${montoNum}, Renta=${rentaNum}, Edad=${edadNum}, Cuotas=${cuotasNum}`);

        if (edadNum < 18) {
            return res.status(400).json({ message: 'La edad debe ser mayor o igual a 18 años.' });
        }

        const tasaBaseMensual = 0.015;

        // Cálculo del factor de riesgo por renta
        const cargaRenta = montoNum / rentaNum;
        let factorRiesgoRenta = 1.0;
        if (cargaRenta > 5) factorRiesgoRenta = 1.5;
        else if (cargaRenta > 2) factorRiesgoRenta = 1.2;
        // --- PASO 3: Ver el factor de riesgo calculado para la renta ---
        console.log(`Factor de Riesgo por Renta: ${factorRiesgoRenta} (Carga: ${cargaRenta.toFixed(2)})`);

        // Cálculo del factor de riesgo por plazo
        let factorRiesgoPlazo = 1.0;
        if (cuotasNum > 36) factorRiesgoPlazo = 1.4;
        else if (cuotasNum > 12) factorRiesgoPlazo = 1.15;
        
        // Cálculo del factor de riesgo por edad
        let factorRiesgoEdad = 1.0;
        if (edadNum < 25 || edadNum > 60) {
            factorRiesgoEdad = 1.1;
        }
        // --- PASO 4: Ver el factor de riesgo calculado para la edad ---
        console.log(`Factor de Riesgo por Edad: ${factorRiesgoEdad}`);
        
        // Cálculo de la tasa final
        const tasaInteresMensual = Math.min(
            tasaBaseMensual * factorRiesgoRenta * factorRiesgoPlazo * factorRiesgoEdad,
            0.035
        );
        // --- PASO 5: Ver la tasa de interés final ---
        console.log(`Tasa de Interés Mensual FINAL: ${(tasaInteresMensual * 100).toFixed(2)}%`);

        const valorCuota = montoNum * (tasaInteresMensual * Math.pow(1 + tasaInteresMensual, cuotasNum)) / (Math.pow(1 + tasaInteresMensual, cuotasNum) - 1);
        const costoTotal = valorCuota * cuotasNum;
        const caeAproximado = Math.pow(1 + tasaInteresMensual, 12) - 1;

        const result = {
            valorCuota: Math.round(valorCuota),
            costoTotal: Math.round(costoTotal),
            tasaMensual: (tasaInteresMensual * 100).toFixed(2),
            cae: (caeAproximado * 100).toFixed(2),
            montoSolicitado: montoNum,
            cuotas: cuotasNum,
        };

        console.log('--- SIMULACIÓN PROCESADA CON ÉXITO ---');
        return res.status(200).json({ message: 'Simulación procesada', result });

    } catch (error) {
        console.error('!!! ERROR EN SIMULACIÓN:', error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};