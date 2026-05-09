# tests/test_simulacion.py
"""
HU1: Probabilidad de aceptación de crédito
YO COMO: Usuario del banco
QUIERO: Ver la probabilidad de que me acepten el crédito en base a los datos
        que entregue en el simulador
PARA: Evitar solicitudes innecesarias que puedan ser rechazadas

Endpoint probado: POST /api/simulacion
"""

import unittest
import requests

BASE_URL = "http://localhost:3001"


class TestSimulacionEndpoint(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """
        Prepara los datos de prueba antes de ejecutar los tests de esta clase.
        Se ejecuta UNA sola vez antes de todos los métodos de prueba.
        """
        cls.url = f"{BASE_URL}/api/simulacion"

        # Datos válidos: usuario con buen perfil financiero
        cls.payload_valido = {
            "monto": 5000000,
            "plazo": 24,
            "ingreso_mensual": 800000,
            "deudas_actuales": 100000,
            "tipo_credito": "consumo"
        }

        # Datos inválidos: campos faltantes o valores incorrectos
        cls.payload_invalido = {
            "monto": -1000,       # monto negativo → inválido
            "plazo": "",          # plazo vacío → inválido
            "ingreso_mensual": None  # sin ingreso → inválido
        }

        print("\n[setUpClass] Datos de prueba para /api/simulacion preparados.")

    @classmethod
    def tearDownClass(cls):
        """
        Limpieza después de todos los tests de esta clase.
        Se ejecuta UNA sola vez al final.
        """
        print("\n[tearDownClass] Pruebas de simulación finalizadas.")

    # ------------------------------------------------------------------
    # CASO DE PRUEBA 1
    # Criterio de Aceptación 1 — HU1
    #
    # Input:        monto=5000000, plazo=24, ingreso_mensual=800000,
    #               deudas_actuales=100000, tipo_credito="consumo"
    # Contexto:     El usuario ingresa datos completos y válidos
    # Salida esp.:  HTTP 200 con campo "probabilidad" entre 0 y 100
    # ------------------------------------------------------------------
    def test_01_simulacion_datos_validos_retorna_probabilidad(self):
        """
        DADO que el usuario quiere simular un crédito,
        CUANDO ingresa datos completos y válidos,
        ENTONCES el sistema retorna la probabilidad de aceptación (0-100).
        """
        response = requests.post(self.url, json=self.payload_valido)

        self.assertIn(
            response.status_code, [200, 201],
            msg=f"Se esperaba HTTP 200/201, se obtuvo {response.status_code}"
        )

        data = response.json()

        self.assertIn(
            "probabilidad", data,
            msg="La respuesta debe contener el campo 'probabilidad'"
        )
        self.assertIsInstance(
            data["probabilidad"], (int, float),
            msg="'probabilidad' debe ser numérico"
        )
        self.assertGreaterEqual(data["probabilidad"], 0)
        self.assertLessEqual(data["probabilidad"], 100)

    # ------------------------------------------------------------------
    # CASO DE PRUEBA 2
    # Criterio de Aceptación 2 — HU1
    #
    # Input:        monto=-1000, plazo="", ingreso_mensual=None
    # Contexto:     El usuario ingresa datos incompletos o inválidos
    # Salida esp.:  HTTP 400/422 con mensaje de error indicando corrección
    # ------------------------------------------------------------------
    def test_02_simulacion_datos_invalidos_retorna_error(self):
        """
        DADO que el usuario ingresa datos en el simulador,
        CUANDO los datos sean incompletos o inválidos,
        ENTONCES el sistema debe retornar un error (400/422) solicitando corrección.
        """
        response = requests.post(self.url, json=self.payload_invalido)

        self.assertIn(
            response.status_code, [400, 422],
            msg=f"Se esperaba HTTP 400/422, se obtuvo {response.status_code}"
        )

        data = response.json()

        tiene_error = (
            "error" in data or
            "message" in data or
            "msg" in data or
            "errors" in data
        )
        self.assertTrue(
            tiene_error,
            msg="La respuesta de error debe contener un campo indicando el problema"
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)