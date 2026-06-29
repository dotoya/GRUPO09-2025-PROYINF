# Grupo 03
Este es el repositorio del *Grupo 03*, cuyos integrantes son:
* Nicolas Ignacio Vargas Ezquerra - 202373123-4
* Daniel Andres San Martin Diaz - 202373106-4
* Matias Gomez - 202373033-5
* Salvador Esteban Molina Romero - 202373581-7
* Fabian San Martin - 202304650-7
* **Tutor**: Miguel Huerta
## Wiki
Puede acceder a la Wiki mediante el siguiente [enlace](https://github.com/dotoya/GRUPO09-2025-PROYINF/wiki#objetivos-del-proyecto)
## Videos
* [Video presentación cliente](https://aula.usm.cl/pluginfile.php/7621199/mod_resource/content/2/video1352931478.mp4)
* [Test Hito3](https://youtu.be/VIYJMNx5HbE)
* [Test Hito5](https://youtu.be/Rxpma8kiMzI)
## ⚠️ Variables de Entorno (Antes de usar Docker)
Para manejar datos sensibles de seguridad y credenciales (como la comprobación de identidad de Azure y el JWL), el proyecto utiliza un archivo `.env`.

1. Renombra el archivo `.env.example` a `.env` en la raíz del proyecto.
2. Abre el nuevo `.env` y configura la cuenta de administrador a tu gusto.
3. Ingresa las llaves de la API de Azure.
4. Ingresa la clave de seguridad para las sesiones en la variable `JWT_SECRET`.

*(Nota: Si estás testeando el proyecto, puedes usar las credenciales de prueba para Azure y la clave JWT_SECRET que dejamos en el archivo `Codigo_copia(nuevo).pdf`).*

Una vez configurado, estás listo para levantar el proyecto.

## Levantamiento del Proyecto
**Importante:** Asegúrate de haber configurado las **Variables de Entorno** (paso anterior) antes de continuar. De lo contrario, los contenedores fallarán al iniciar.

Para iniciar los servicios (Frontend con *hot-reload*, Backend y Base de Datos), sigue estos pasos:

1. **Navega a la carpeta del proyecto:**
   Abre tu terminal y dirígete al directorio donde se encuentra el archivo `docker-compose.yml`:
   ```bash
   cd analisis-y-diseno-de-software-main/mi-proyecto-node-docker
   ```

2. **Levantamiento de Docker-Compose**

   Ejecuta el siguiente comando y déjalo corriendo:
   ```bash
   sudo docker compose up --build
   ```

### Accesos Rápidos
Una vez que Docker esté corriendo, puedes acceder a:

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **API Backend:** [http://localhost:3001](http://localhost:3001)
- **Base de Datos:** Puerto `5432` (User/Pass definidos en tu `.env`)

## Sistema de seguridad
El sistema de identificación facial, que compara la foto del carnet con la imagen del usuario, funciona parcialmente. Su uso completo depende de la autorización de Microsoft para habilitar todas las funciones del servicio.
