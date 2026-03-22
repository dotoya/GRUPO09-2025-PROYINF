# Grupo 09

Este es el repositorio del *Grupo 09*, cuyos integrantes son:

* Nicolas Ignacio Vargas Ezquerra - 202373123-4
* Daniel Andres San Martin Diaz - 202373106-4
* Matias Gomez - 202373033-5
* Salvador Esteban Molina Romero - 202373581-7
* Fabian San Martin - 202304650-7
* **Tutor**: Matias Andree Barrera Vergara

## Wiki

Puede acceder a la Wiki mediante el siguiente [enlace](https://github.com/dotoya/GRUPO09-2025-PROYINF/wiki#objetivos-del-proyecto)

## Videos

* [Video presentación cliente](https://aula.usm.cl/pluginfile.php/7621199/mod_resource/content/2/video1352931478.mp4)
* [Test Hito3](https://youtu.be/VIYJMNx5HbE)
* [Test Hito5](https://youtu.be/Rxpma8kiMzI)

## DOCKER

El archivo `docker-compose.yml` no se subió al repositorio porque contenía claves de Azure y violaba las políticas de seguridad de GitHub. Para permitir que el proyecto se ejecute, hemos incluido un PDF llamado `Codigo_copia.pdf` en la raíz del repositorio que contiene el código completo que debe pegarse en `docker-compose.yml`.

Instrucciones breves:
- Abra la carpeta raíz `mi-proyecto-node-docker`.
- Abra (o cree) el archivo `docker-compose.yml`.
- Localice la sección marcada exactamente con:
   --- RELLENA ESTAS 4 LÍNEAS ---
- Copie el contenido desde `Codigo_copia.pdf` y péguelo en lugar de esas 4 líneas.
- Guarde `docker-compose.yml`.
 
Esto es imprescindible para que el backend (base de datos y servidor) pueda levantarse correctamente.


## Indicaciones para levantar el proyecto

Para levantar el proyecto, sigue estos pasos:

1.  **Levantamiento de Docker (Frontend (dev hotswap), Backend y Base de Datos):**
    * Abre un terminal en la dirección del proyecto y navega hacia la carpeta 'mi-proyecto-node-docker'.
         ```bash
        cd analisis-y-diseno-de-software-main/mi-proyecto-node-docker
         ```
    * Ejecuta el siguiente comando y déjalo corriendo:
        ```bash
        sudo docker-compose up --build
        ```
   * Listo, el proyecto deberia estar levantado.

## Sistema de seguridad

El sistema de identificación facial, que compara la foto del carnet con la imagen del usuario, funciona parcialmente. Su uso completo depende de la autorización de Microsoft para habilitar todas las funciones del servicio.










