# Grupo 09

Este es el repositorio del *Grupo 09*, cuyos integrantes son:

* Nicolas Ignacio Vargas Ezquerra - 202373123-4
* Daniel Andres San Martin Diaz - 202373106-4
* Matias Gomez - 202373033-5
* Salvador Esteban Molina Romero - 202373581-7
* **Tutor**: Matias Andree Barrera Vergara

## Wiki

Puede acceder a la Wiki mediante el siguiente [enlace](https://github.com/dotoya/GRUPO09-2025-PROYINF/wiki#objetivos-del-proyecto)

## Videos

* [Video presentación cliente](https://aula.usm.cl/pluginfile.php/7621199/mod_resource/content/2/video1352931478.mp4)
* [Test Hito3](https://youtu.be/VIYJMNx5HbE)

## DOCKER

El archivo `docker-compose.yml` no se subió al repositorio porque contenía claves de Azure y violaba las políticas de seguridad de GitHub. Para permitir que el proyecto se ejecute, hemos incluido un PDF llamado `Codigo_copia.pdf` en la raíz del repositorio que contiene el código completo que debe pegarse en `docker-compose.yml`.

Instrucciones breves:
- Abra la carpeta raíz `mi-proyecto-node-docker`.
- Abra (o cree) el archivo `docker-compose.yml`.
- Localice la sección marcada exactamente con:
  # --- RELLENA ESTAS 4 LÍNEAS ---
- Copie el contenido desde `Codigo_copia.pdf` y péguelo en lugar de esas 4 líneas.
- Guarde `docker-compose.yml` y luego ejecute:
  ```bash
  sudo docker-compose up --build
  ```
Esto es imprescindible para que el backend (base de datos y servidor) pueda levantarse correctamente.


## Indicaciones para levantar el proyecto

Para levantar el proyecto, sigue estos pasos:

1.  **Levantar el Backend (Base de Datos y Servidor):**
    * Abre una terminal en la carpeta raíz `mi-proyecto-node-docker`.
    * Ejecuta el siguiente comando y déjalo corriendo:
        ```bash
        sudo docker-compose up --build
        ```

2.  **Levantar el Frontend (Cliente):**
    * Abre una **segunda terminal** (sin cerrar la primera).
    * Ingresa a la carpeta `client`.
    * Ejecuta los siguientes comandos:
        ```bash
        # Instala las dependencias (solo la primera vez)
        npm install
        
        # Inicia el servidor de desarrollo
        npm run dev
        ```

3.  **Acceder a la Aplicación:**
    * Luego de ejecutar `npm run dev`, la terminal te mostrará un enlace local (usualmente algo como `http://localhost:5173`).
    * Abre ese enlace en tu navegador para ver la página web.

## Documentación

La documentación completa de la API se encuentra en la carpeta `api` del servidor. Puedes encontrar toda la información detallada sobre los endpoints, modelos y funcionalidades en el archivo `README.md` dentro de esa carpeta.


