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


