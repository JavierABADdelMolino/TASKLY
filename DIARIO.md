# 📘 Diario de Desarrollo - Proyecto Taskly

Este documento registra el desarrollo diario del proyecto **Taskly**, un gestor de tareas basado en el stack MERN (MongoDB, Express, React, Node.js). El objetivo es completar un TFG de aproximadamente 40 horas de trabajo documentado.

---

## 🗓️ Día 1 - Lunes 5 de mayo de 2025

### ✅ Tareas realizadas

* Reinstalación completa de Homebrew en macOS 12.7.
* Instalación manual y nativa de Node.js con todas sus dependencias (Python, CMake, LLVM, etc).
* Verificación de herramientas (`brew`, `node`, `npm`, `npx`, `git`).
* Decisión de utilizar estructura MERN 100% nativa.
* Inicio de documentación técnica.

### 📝 Observaciones

* Algunas instalaciones tardaron por ser compiladas desde cero.
* La versión de macOS está clasificada como Tier 3, lo que genera algunos warnings pero sin impacto funcional directo.

---

## 🗓️ Día 2 - Martes 6 de mayo de 2025

### ✅ Tareas realizadas

* Instalación y configuración de MongoDB Community 7.0 de forma nativa.
* Instalación manual de `mongosh` sin depender del nodo de Homebrew.
* Creación de usuario administrador en MongoDB (`root`).
* Habilitación del control de acceso (`authorization: enabled`).
* Comprobación de todos los componentes principales del stack (Node, Mongo, Git, etc).
* Inicio y redacción del archivo `INSTALL.md`.
* Inicio de redacción del presente `DIARIO.md`.
* Creación del proyecto `TFG-DAM-JavierABAD` con estructura nativa recomendada por la documentación del stack MERN.
* Inicialización del backend con `npm init -y` y estructura de carpetas `src`, `controllers`, `models`, `routes`, `config`, `index.js`, `.env` y `README.md`.
* Creación del frontend con `create-react-app` (pese a advertencia de deprecación).
* Organización de la estructura raíz incluyendo carpetas `backend`, `frontend`, y documentación (`INSTALL.md`, `DIARIO.md`, `README.md`).
* Configuración de la conexión a la base de datos desde el backend utilizando `.env` y archivo de conexión en `config/database.js`.
* Comprobación exitosa de la conexión a MongoDB con `mongoose.connect()`.
* Inclusión de extensión oficial de MongoDB en Visual Studio Code y conexión desde la propia interfaz.
* Inicialización de repositorio Git desde Visual Studio Code y publicación directa en GitHub desde la interfaz gráfica.
* Implementación del archivo `routes/ping.routes.js` como ruta de prueba para comprobar el funcionamiento del backend.
* Verificación de ejecución simultánea de backend (`npm run dev`) y frontend (`npm start`).
* Confirmación de funcionamiento correcto de ambos entornos.
* Creación de estructura recomendada para `frontend/src`: `assets`, `components`, `context`, `hooks`, `pages`, `services`, `utils`, `styles`.
* Inclusión de archivos `.gitkeep` para permitir el seguimiento de carpetas vacías por Git.
* Inicio del frontend con npm start y verificación de la aplicación React en localhost:3000.
* Modificación del archivo App.js en React para hacer fetch a /api/ping y mostrar estado del backend.
* Verificación exitosa de comunicación frontend ↔ backend en tiempo real desde el navegador.

### 📝 Observaciones

* La creación del frontend generó advertencias por deprecación de `create-react-app`, pero se decidió mantenerlo para facilitar el primer proyecto.
* Se descartaron frameworks como `Vite` para mantener el enfoque en herramientas ampliamente documentadas y sencillas.
* El proyecto fue nombrado inicialmente como `TFG JavierABAD`, pero se renombró a `TFG-DAM-JavierABAD` para evitar espacios y clarificar su uso académico.
* Se generaron archivos de documentación Markdown para incluir en el repositorio (`README.md`, `INSTALL.md`, `DIARIO.md`).
* Se comprobó con éxito el funcionamiento completo del entorno de desarrollo.
* Se decidió mantener las instalaciones y estructuras 100% nativas para evitar conflictos de compatibilidad en el futuro.
* Se priorizó el uso de `fetch` sobre `axios` por ser una API nativa del navegador.
* Ambas partes del stack corren simultáneamente y funcionan correctamente.
* Las advertencias del driver de MongoDB (useNewUrlParser, useUnifiedTopology) son inofensivas en esta versión.
* El entorno completo ha quedado montado y probado, con logs limpios y conexiones operativas.

---

*(continúa actualizando este documento día a día...)*
