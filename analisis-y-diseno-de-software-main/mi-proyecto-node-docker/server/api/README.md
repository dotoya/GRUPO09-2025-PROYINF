# DOCUMENTACIÓN DE API

Esta API gestiona la autenticación de usuarios y la simulación de créditos. Se divide en dos módulos principales: Autenticación y Simulación.

---

## URL BASE

La URL base para todos los endpoints de la API es:

http://localhost:PUERTO/api

---

## MÓDULO DE AUTENTICACIÓN (/api/auth)

Este módulo maneja el registro e inicio de sesión de los usuarios.

---

### 1. Registrar Usuario

**Endpoint:**  
`POST /api/auth/register`

**Descripción:**  
Crea una nueva cuenta de usuario en el sistema.

**Request Body (JSON):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "miPasswordSegura123",
  "rut": "12345678-9",
  "birthdate": "YYYY-MM-DD"
}
```

**Validaciones:**
- Los campos `email`, `password`, `rut` y `birthdate` son obligatorios.  
- La contraseña debe tener al menos 6 caracteres.  
- El RUT debe tener el formato `12345678-9` (sin puntos, con guion).

**Respuestas:**
- **201 Created:** Usuario registrado con éxito.  
- **400 Bad Request:** Faltan campos, la contraseña es muy corta o el formato del RUT es incorrecto.  
- **409 Conflict:** El email proporcionado ya está en uso.  
- **500 Internal Server Error:** Error en el servidor.

---

### 2. Iniciar Sesión

**Endpoint:**  
`POST /api/auth/login`

**Descripción:**  
Autentica a un usuario y devuelve un token JWT con una validez de 1 hora.

**Request Body (JSON):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "miPasswordSegura123"
}
```

**Respuestas:**
- **200 OK:** Inicio de sesión exitoso.  
- **400 Bad Request:** Faltan email o password.  
- **401 Unauthorized:** Credenciales inválidas (email no encontrado o contraseña incorrecta).  
- **500 Internal Server Error:** Error en el servidor.

---

## MÓDULO DE SIMULACIÓN (/api/simulacion)

Este módulo proporciona los cálculos para simulaciones de crédito.

---

### 1. Realizar Simulación

**Endpoint:**  
`POST /api/simulacion`

**Descripción:**  
Procesa una solicitud de simulación de crédito.  
**Nota:** Este endpoint no requiere autenticación.

**Request Body (JSON):**
```json
{
  "rut": "12345678-9",
  "edad": 30,
  "monto": 1000000,
  "renta": 500000,
  "cuotas": 24
}
```

**Respuestas:**
- **200 OK:** Simulación procesada con éxito.  
- **400 Bad Request:** La edad debe ser mayor o igual a 18 años.  
- **500 Internal Server Error:** Error en el servidor durante el cálculo.

---

### Lógica de Negocio (Cálculo de Simulación)

El cálculo de la tasa de interés se basa en varios factores de riesgo:

1. **Tasa Base:** Inicia con una tasa mensual de 0.015 (1.5%).  
2. **Factor Renta:**  
   - Si la carga (monto/renta) es mayor a 5, el factor es 1.5.  
   - Si la carga es mayor a 2, el factor es 1.2.  
3. **Factor Plazo:**  
   - Si las cuotas son mayores a 36, el factor es 1.4.  
   - Si las cuotas son mayores a 12, el factor es 1.15.  
4. **Factor Edad:**  
   - Si la edad es menor a 25 o mayor a 60, el factor es 1.1.  
5. **Tasa Final:**  
   - Tasa Base × Factor Renta × Factor Plazo × Factor Edad.  
   - Tasa máxima mensual: 0.035 (3.5%).

---

## ESQUEMA DE BASE DE DATOS (Tabla users)

La tabla `users` se define en PostgreSQL con la siguiente estructura:

| Columna        | Tipo          | Restricciones                | Descripción                           |
|----------------|---------------|-------------------------------|---------------------------------------|
| `id`           | SERIAL        | PRIMARY KEY                  | Identificador único del usuario.      |
| `email`        | VARCHAR(255)  | UNIQUE NOT NULL              | Email del usuario.                    |
| `password_hash`| VARCHAR(255)  | NOT NULL                     | Contraseña hasheada (bcrypt).         |
| `rut`          | VARCHAR(32)   | Nullable                     | RUT del usuario.                      |
| `birthdate`    | DATE          | Nullable                     | Fecha de nacimiento.                  |
| `created_at`   | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP     | Fecha de creación del registro.       |

---


## MÓDULO DE VERIFICACIÓN (/api/verify)

Este módulo ofrece funcionalidad para extraer datos de un carnet de identidad y realizar verificación biométrica (comparar la foto del carnet con una selfie). El módulo se apoya en servicios de Azure (Document Analysis / Form Recognizer y Face API).

### Paquetes utilizados
- `@azure/ai-form-recognizer` (DocumentAnalysisClient)
- `@azure/cognitiveservices-face` (FaceClient)
- `@azure/core-auth` (AzureKeyCredential)
- `multer` (subida de archivos en memoria)

### Variables de entorno necesarias
Configurar las credenciales y endpoints de Azure en las variables de entorno del servidor (no subir estas claves al control de versiones):

- `AZURE_DOC_ENDPOINT` - Endpoint del servicio de Document Analysis / Form Recognizer.
- `AZURE_DOC_KEY` - Key para Document Analysis.
- `AZURE_FACE_ENDPOINT` - Endpoint del Face API.
- `AZURE_FACE_KEY` - Key para Face API.

---

### 1. Escanear Carnet

**Endpoint:**
`POST /api/verify/escanear-carnet`

**Descripción:**
Recibe una imagen del carnet (campo `fotoCarnet`) y usa el modelo pre-entrenado `prebuilt-idDocument` de Azure para extraer campos como nombre, apellidos, número de documento (RUT) y fecha de nacimiento.

**Tipo de petición:** multipart/form-data

**Campos esperados:**
- `fotoCarnet` (file) — imagen del carnet.

**Respuesta (ejemplo, éxito):**
```json
{
   "message": "Datos extraídos con éxito",
   "data": {
      "nombre": "Juan",
      "apellidos": "Pérez",
      "rut": "12345678-9",
      "fechaNacimiento": "1990-01-01"
   }
}
```

**Códigos de respuesta importantes:**
- **200 OK:** Datos extraídos correctamente.
- **400 Bad Request:** No se recibió archivo o no se pudo analizar el documento.
- **500 Internal Server Error:** Error durante la comunicación con los servicios de Azure o error interno.

---

### 2. Verificar Rostro

**Endpoint:**
`POST /api/verify/verificar-rostro`

**Descripción:**
Recibe dos imágenes: la del carnet (`fotoCarnet`) y una selfie (`fotoSelfie`). Detecta las caras en ambas imágenes con Face API y realiza una verificación (compare/verify) entre los faceId obtenidos.

**Tipo de petición:** multipart/form-data

**Campos esperados:**
- `fotoCarnet` (file) — imagen del carnet.
- `fotoSelfie` (file) — imagen del usuario (selfie).

**Respuesta (ejemplo, verificación exitosa):**
```json
{
   "message": "Verificación exitosa.",
   "isIdentical": true,
   "confidence": 0.87
}
```

**Respuesta (ejemplo, caras no coinciden):**
```json
{
   "message": "Las caras no coinciden.",
   "isIdentical": false,
   "confidence": 0.22
}
```

**Códigos de respuesta importantes:**
- **200 OK:** Verificación exitosa (cuando `isIdentical` es true).
- **400 Bad Request:** Faltan archivos, no se detectó rostro en alguna de las imágenes, o las caras no coinciden (el controlador actual devuelve 400 si las caras no coinciden).
- **500 Internal Server Error:** Error en la comunicación con Azure o error interno.

---

### Notas de implementación y seguridad

- El módulo usa `multer` con `memoryStorage()` por lo que los archivos se reciben en memoria (`req.file.buffer` o `req.files[..].buffer`) y no se escriben en disco.
- Las claves/credentials de Azure deben ser almacenadas en variables de entorno y nunca subirlas al repositorio.
- En producción conviene proteger estos endpoints (por ejemplo, requerir autenticación, límites de tamaño de archivo, validación adicional y registro de auditoría).
- Revisar los límites y costos del servicio Azure Face y Form Recognizer al activar las APIs.

---

**Última actualización:** 07/11/2025  

