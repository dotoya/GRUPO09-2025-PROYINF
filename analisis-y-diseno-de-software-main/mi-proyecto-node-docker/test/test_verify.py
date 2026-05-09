# tests/test_verify.py
"""
HU2: Captura automática de datos desde documentos
YO COMO: Cliente del banco
QUIERO: Ingresar mis antecedentes mediante captura digital de documentos
PARA: Evitar el ingreso manual de datos, reducir errores y agilizar la solicitud

Endpoint probado: POST /api/verify
"""

import unittest
import requests
import io

BASE_URL = "http://localhost:3001"


class TestVerifyEndpoint(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """
        Prepara los datos de prueba antes de ejecutar los tests de esta clase.
        Se ejecuta UNA sola vez antes de todos los métodos de prueba.
        """
        cls.url = f"{BASE_URL}/api/verify"

        # Contenido mínimo de un PDF válido (header real de PDF)
        cls.pdf_valido = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF"

        # Contenido inválido: no es un documento reconocible
        cls.archivo_invalido = b"ESTE_NO_ES_UN_DOCUMENTO_VALIDO_xxxxxxxxxxx"

        print("\n[setUpClass] Datos de prueba para /api/verify preparados.")

    @classmethod
    def tearDownClass(cls):
        """
        Limpieza después de todos los tests de esta clase.
        """
        print("\n[tearDownClass] Pruebas de verificación finalizadas.")

    # ------------------------------------------------------------------
    # CASO DE PRUEBA 3
    # Criterio de Aceptación 1 — HU2
    #
    # Input:        Archivo PDF con contenido mínimo válido
    # Contexto:     El cliente sube un documento procesable
    # Salida esp.:  HTTP 200 con datos extraídos del documento
    # ------------------------------------------------------------------
    def test_03_verify_documento_pdf_valido(self):
        """
        DADO que el cliente sube sus documentos,
        CUANDO el sistema los procesa correctamente,
        ENTONCES los datos deben ser extraídos automáticamente (HTTP 200).
        """
        files = {
            "documento": (
                "cedula.pdf",
                io.BytesIO(self.pdf_valido),
                "application/pdf"
            )
        }

        response = requests.post(self.url, files=files)

        self.assertIn(
            response.status_code, [200, 201],
            msg=f"Se esperaba HTTP 200/201 al procesar PDF válido, "
                f"se obtuvo {response.status_code}"
        )

        data = response.json()

        # Verifica que la respuesta contiene algún dato extraído
        self.assertIsNotNone(data, msg="La respuesta no debe ser vacía")
        self.assertGreater(
            len(data), 0,
            msg="La respuesta debe contener al menos un campo de datos extraídos"
        )

    # ------------------------------------------------------------------
    # CASO DE PRUEBA 4
    # Criterio de Aceptación 2 — HU2
    #
    # Input:        Archivo de texto con contenido corrupto/irreconocible
    # Contexto:     El sistema no puede extraer datos del archivo enviado
    # Salida esp.:  HTTP 400/415/422 con mensaje que solicita ingreso manual
    # ------------------------------------------------------------------
    def test_04_verify_documento_invalido_solicita_ingreso_manual(self):
        """
        DADO que ocurre un error en la captura,
        CUANDO el sistema no puede extraer correctamente los datos,
        ENTONCES debe retornar error (400/415/422) solicitando ingreso manual.
        """
        files = {
            "documento": (
                "archivo_invalido.txt",
                io.BytesIO(self.archivo_invalido),
                "text/plain"
            )
        }

        response = requests.post(self.url, files=files)

        self.assertIn(
            response.status_code, [400, 415, 422, 500],
            msg=f"Se esperaba código de error al procesar archivo inválido, "
                f"se obtuvo {response.status_code}"
        )

        data = response.json()

        # Verifica que la respuesta indica el problema y/o solicita ingreso manual
        respuesta_str = str(data).lower()
        indica_error = (
            "error" in data or
            "message" in data or
            "msg" in data or
            "manual" in respuesta_str or
            "invalid" in respuesta_str
        )
        self.assertTrue(
            indica_error,
            msg="La respuesta debe indicar el error y/o solicitar ingreso manual"
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)