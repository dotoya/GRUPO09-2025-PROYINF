// Archivo: server/api/simulacion/simulacion.controller.js

// Aquí pondremos la lógica para procesar una simulación de crédito.
// Por ahora validamos los campos básicos y devolvemos un resultado simulado simple.

exports.simular = async (req, res) => {
    try {
        const { rut, edad, monto, renta, cuotas } = req.body;
        if (!rut || !edad || !monto || !renta || !cuotas) {
            return res.status(400).json({ message: 'Faltan datos en la simulación.' });
        }

        // Aquí podrías insertar lógica real: cálculo de cuota, tasas, verificación de riesgo, etc.
        // Ejemplo simple: cuota mensual = (monto / cuotas) + 0.02 * monto / cuotas (2% fee)
        const cuotaBase = Number(monto) / Number(cuotas);
        const cuotaConFee = cuotaBase * 1.02;

        const result = {
            cuotaMensual: Number(cuotaConFee.toFixed(2)),
            montoSolicitado: Number(monto),
            cuotas: Number(cuotas),
        };

        console.log('Simulación recibida:', req.body);
        return res.status(200).json({ message: 'Simulación procesada', result });
    } catch (error) {
        console.error('Error en simulación:', error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};
