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

## 🗓️ Día 3 - Martes 8 de mayo de 2025

### ✅ Tareas realizadas

* Modificación del archivo de conexión de MongoDB (mongoose.connect) para eliminar las advertencias useNewUrlParser y useUnifiedTopology según documentación oficial.

* Modificación del README.md general del proyecto para incluir la estructura de ramas Git que se seguirá durante el desarrollo.

* Creación de la rama dev desde main para desarrollo activo.

* Creación de la rama docs desde main para gestión de documentación.

* Se plantea como valor añadido la integración futura de una funcionalidad de IA utilizando la API de OpenAI para sugerencias inteligentes.

### 📝 Observaciones

* El entorno de desarrollo ha quedado completamente funcional y documentado.

* Se considera cerrada la fase de preparación y configuración del entorno base.

* A partir del siguiente día comenzará el desarrollo de funcionalidades específicas del gestor de tareas Taskly.

---

## 🗓️ Día 4 - Jueves 9 de mayo de 2025

### ✅ Tareas realizadas

* Inicio del desarrollo de funcionalidades: creación de la rama `feature/auth-users` desde `dev`.
* Implementación del modelo `User` con Mongoose, incluyendo validaciones y método `comparePassword`.
* Instalación de las dependencias `bcrypt` y `jsonwebtoken` para autenticación.
* Creación del controlador `authController.js` con las funciones `registerUser` y `loginUser`.
* Creación del archivo `routes/auth.routes.js` y montaje correcto en `index.js`.
* Configuración de variable `JWT_SECRET` en el archivo `.env`.
* Verificación de las rutas `/api/auth/register` y `/api/auth/login` mediante Postman.
* Corrección de errores comunes de configuración (`secretOrPrivateKey must have a value`, `handler must be a function`).
* Confirmación del correcto cifrado de contraseñas y emisión de tokens JWT.
* Implementación de middleware `authMiddleware.js` para validar el token JWT.
* Creación de ruta protegida `/api/private` para testear acceso autenticado.
* Pruebas realizadas desde Postman con envío de token mediante header `Authorization: Bearer`.
* Confirmación del flujo completo: registro → login → token → acceso protegido.

### 📝 Observaciones

* Las rutas han sido validadas con éxito mediante pruebas manuales usando Postman.
* Las validaciones básicas se han definido directamente en el esquema Mongoose, lo que puede requerir refactorización si se complica la lógica.
* El flujo de autenticación básico (registro y login) está finalizado y listo para integrar en futuras vistas del frontend.
* Se aprendió el funcionamiento de los middleware personalizados en Express.
* Se confirmó que `fetch` puede manejar JWT si se configura correctamente el header.
* El sistema de autenticación está funcional y listo para extenderse a rutas de tareas.

---

## 🗓️ Día 5 - Sábado 10 de mayo de 2025

### ✅ Tareas realizadas

* Revisión del sistema de autenticación implementado previamente en la rama feature/auth-users.
* Verificación de la validación automática del token JWT al iniciar la aplicación.
* Confirmación del redireccionamiento automático al Dashboard cuando el usuario ya está autenticado.
* Pruebas manuales del flujo: usuario con token válido en localStorage accede directamente al Dashboard.
* Deshechos todos los cambios relacionados con personalización de estilos (SCSS, Bootstrap, variables CSS).

📝 Observaciones

* Se decidió no continuar con la personalización de estilos ni con la modificación profunda de Bootstrap para evitar complejidad innecesaria en esta etapa del proyecto.
* El foco vuelve a estar en la funcionalidad principal: autenticación, gestión de tareas y experiencia de usuario base.
* Se mantiene una versión estable y funcional del proyecto, lista para continuar con el desarrollo de vistas privadas y manejo de tareas.
* El próximo paso será implementar la lógica de persistencia de usuario autenticado y comenzar con la vista de tareas por usuario.

---

## 🗓️ Día 6 - Domingo 11 de mayo de 2025

### ✅ Tareas realizadas

* Refactorización del sistema de autenticación en el frontend:
  * Eliminación del almacenamiento del usuario completo en localStorage.
  * Uso de sessionStorage para guardar únicamente el token JWT.
  * Implementación de `useEffect` en el `AuthContext` para recuperar el usuario automáticamente desde `/api/auth/me`.
  * Redirección automática al Dashboard si el usuario ya está autenticado.

* Mejora de seguridad en rutas privadas:
  * `PrivateRoute` protegido correctamente por el estado `user`.
  * Logout centralizado y limpio con redirección a `/`.

* Actualizaciones en el backend:
  * Implementación de la ruta protegida `GET /api/auth/me` para obtener los datos del usuario autenticado.
  * Mejora del middleware `authMiddleware` con nombre y estructura estándar.
  * Ajuste del controlador `authController` para responder con los datos del usuario desde el token.

* Mejoras en el formulario de registro:
  * Añadido campo de confirmación de contraseña con validación previa.
  * Añadidos 3 desplegables (día, mes, año) para introducir la fecha de nacimiento.
  * Validación completa de la fecha antes de enviar al backend.

* Cambios en el modelo de usuario:
  * Campo obligatorio `birthDate` añadido al esquema de Mongoose.
  * Adaptación del controlador `registerUser` para recibir y guardar la fecha.

* Eliminación manual de registros previos de MongoDB para evitar conflictos con el nuevo campo obligatorio.

### 📝 Observaciones

* Se confirma que sessionStorage permite mantener la sesión activa mientras el navegador esté abierto, cerrándose automáticamente al salir, lo cual es el comportamiento deseado.
* Se valida correctamente el flujo completo: registro → login → token → usuario → dashboard.
* Las futuras rutas protegidas como `/api/tasks` podrán obtener el usuario autenticado mediante token sin requerir ID manual.
* Todo el sistema de autenticación está ahora estructurado, validado y documentado para ser robusto, seguro y mantenible.

---

## 🗓️ Día 7 - Martes 13 de mayo de 2025

### ✅ Tareas realizadas

* Inicio de la rama `feature/theme-ui` para implementar un sistema de temas claro/oscuro personalizado.
* Integración de Bootstrap mediante archivo `theme.scss`, en lugar del `custom.scss` anterior.
* Organización de la carpeta `styles/` con subcarpetas `base/`, `config/`, `components/` y `themes/`.
* Implementación del componente `ThemeSwitcher` con diseño tipo switch al estilo Apple.
* Activación y persistencia del tema claro/oscuro mediante `data-theme` en `document.documentElement`.
* Añadidas variables personalizadas en `light.scss` y `dark.scss`, mapeadas a `--bs-*` para que Bootstrap responda dinámicamente.
* Inclusión de estructura de layout con componentes `Navbar`, `Footer` y `Layout.jsx`.
* Implementación de `RouteChangeLoader` que muestra un loader al navegar entre páginas.
* Rediseño completo de `Home` y `Dashboard` utilizando clases Bootstrap (`container`, `bg-body-tertiary`, `text-body`, etc.).
* Integración del `ThemeSwitcher` en la `Navbar`, siempre visible.
* Lógica condicional en la `Navbar` para mostrar botones según la ruta (`/` o `/dashboard`).
* Refactor de los modales de login y registro para usar clases Bootstrap (`bg-white`, `shadow`, `rounded`, etc.).
* Correcciones de visibilidad en modo oscuro: inputs, formularios, botones y navbar.

### 📝 Observaciones

* Se detectaron múltiples problemas visuales en modo oscuro debido a clases de Bootstrap que no heredan variables dinámicas.
* Se redefinieron las variables `--bs-body-bg`, `--bs-body-color`, `--bs-tertiary-bg-rgb`, etc., para asegurar compatibilidad total.
* El modo oscuro aún requiere mejoras visuales de contraste y legibilidad, especialmente en botones, formularios y navbar.
* Se documentó la nueva estructura de carpetas en el `README.md`.
* Se planificó dedicar el Día 8 a mejorar estéticamente el modo oscuro y personalizar profundamente el diseño.

---

## 🗓️ Día 8 - Miércoles 14 de mayo de 2025

### ✅ Tareas realizadas

* Finalización visual y funcional del formulario de **registro en dos pasos**:
  - Validación visual por campo (`email`, `username`, contraseñas, nombre, apellidos, etc.).
  - Eliminación de `alert` en favor de mensajes Bootstrap (`text-danger`, `is-invalid`, `alert-danger`).
  - Uso de `label` en todos los inputs para mejor accesibilidad.
* Refactor completo del formulario de **login** con las mismas validaciones y diseño limpio.
* Integración de subida de avatar en el registro mediante input de tipo `file`.
* Configuración del backend para servir archivos estáticos desde `/uploads` con Express:
  ```js
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  ```
* Comprobación de acceso correcto a imágenes vía `http://localhost:5000/uploads/images/...`.
* Creación y uso de nueva variable de entorno `REACT_APP_FILES_URL` para separar las rutas de imágenes del backend de las del API:
  ```env
  REACT_APP_FILES_URL=http://localhost:5000
  ```
* Refactor del componente `Navbar` para mostrar:
  - Foto de perfil del usuario (avatar en círculo).
  - Nombre (`firstName`) al lado de la imagen.
  - Menú desplegable Bootstrap con botón de “Cerrar sesión”.
* Eliminación del botón antiguo de logout en la navbar.
* Asegurada compatibilidad entre rutas, imágenes locales y el backend Express.

### 📝 Observaciones

* El error `ERR_CONNECTION_REFUSED` al cargar imágenes se resolvió ejecutando correctamente el backend.
* El error `path is not defined` fue corregido añadiendo `const path = require('path')` en el `index.js` del backend.
* Se añadió una imagen de avatar por defecto que se carga automáticamente si el usuario no sube una imagen.
* El sistema actual permite extender el menú desplegable para opciones futuras como “Mi perfil” o “Configuración”.
* Se planificó para el Día 9 mejorar el diseño visual general del dashboard y preparar una vista de perfil editable.

---

## 🗓️ Día 9 - Jueves 16 de mayo de 2025

### ✅ Tareas realizadas

* Implementación completa de subida opcional de avatar durante el registro:
  * Creación del middleware `uploadAvatarMiddleware` usando `multer` para aceptar imágenes.
  * Configuración del backend para servir la carpeta `uploads/avatars` como ruta estática.
  * Ajuste del controlador `registerUser` para guardar la URL del avatar si se sube, o asignar una imagen por defecto según el género.
  * Verificación de nombres de archivo únicos combinando `username` y timestamp para evitar conflictos.
  * Revisión del archivo `app.js` para capturar errores de `multer` mediante middleware global.

* Refactor completo del frontend para eliminar `alert()`:
  * Todos los errores ahora se muestran en el formulario con clases Bootstrap (`text-danger`, `alert-danger`, `is-invalid`).
  * Redirección automática al dashboard tras registro exitoso.
  * Almacén de sesión con `sessionStorage` y recuperación del usuario mediante `/auth/me`.
  * Uso del contexto `AuthContext` para guardar al usuario tras el login o registro.

* Mejora del diseño del `RegisterForm`:
  * División en dos pasos (`RegisterStep1`, `RegisterStep2`) con validaciones independientes.
  * Manejo de errores del servidor (`serverErrors.general`) directamente en los formularios.

* Confirmación de correcto funcionamiento de:
  * Subida de avatar al registrarse.
  * Visualización del avatar en el dashboard y navbar.
  * Logout funcional desde el dropdown.
  * Login posterior con imagen correctamente cargada desde backend.

### 📝 Observaciones

* El registro ahora es robusto, visualmente limpio y funcional tanto si el usuario sube una imagen como si no.
* Se utiliza la variable `REACT_APP_URL` para componer la URL final del avatar en el frontend.
* Se ha mantenido la consistencia con el estilo y flujo del `LoginForm` en cuanto a validaciones y control de errores.
* El sistema actual está preparado para escalar y soportar edición de perfil o recambio de avatar en futuras iteraciones.

---

## 🗓️ Día 10 - Sábado 17 de mayo de 2025

### ✅ Tareas realizadas

* Implementación completa del CRUD de usuario autenticado en el backend (`/api/users`), protegido con JWT:
  * **GET /me**: obtener el perfil del usuario actual.
  * **PUT /me**: actualizar perfil, incluidos campos opcionales y avatar.
  * **PUT /change-password**: cambiar contraseña mediante validación de la actual.
  * **DELETE /me**: eliminación de cuenta de usuario y su avatar asociado.

* Configuración del backend para eliminación física de archivos:
  * Uso de `fs.unlink()` para borrar imágenes anteriores del avatar al actualizar o eliminar el usuario.
  * Ajuste de rutas relativas usando `path.join(__dirname, '..', '..', ...)` para apuntar correctamente a la carpeta `uploads/avatars`.
  * Reestructuración de los logs y protección con `fs.existsSync()` para evitar errores si el archivo no existe.

* Incorporación de lógica para restaurar el avatar por defecto si el usuario elimina su imagen personalizada:
  * Diferenciación clara entre avatares subidos por el usuario (`/uploads/avatars/...`) y avatares por defecto (`/avatars/default-avatar-*.png`).
  * Asignación dinámica del avatar según el género del usuario.
  * Verificación de rutas para evitar eliminar imágenes por defecto accidentalmente.

* Verificación exhaustiva de rutas mediante Postman:
  * Testeo de subida de avatar, cambio de contraseña, eliminación del avatar actual y del usuario completo.
  * Validación del comportamiento correcto del backend ante cada tipo de acción.
  * Revisión manual del sistema de archivos para confirmar eliminación física de imágenes.

### 📝 Observaciones

* Toda la lógica de modificación y eliminación de avatares se ha centralizado correctamente en el controlador `user.controller.js`.
* Las rutas están protegidas por el middleware `verifyToken`, que extrae el `user.id` del token JWT.
* Se ha garantizado la consistencia en la obtención del usuario mediante `req.user.id` en todos los endpoints.
* El sistema ya está preparado para ser conectado con el frontend en React, permitiendo la edición visual del perfil de usuario.
* Mañana se comenzará con el desarrollo de la vista `ProfilePage` para implementar estas funcionalidades desde la interfaz del cliente.

---

## 🗓️ Día 11 - Miércoles 21 de mayo de 2025

### ✅ Tareas realizadas

* Implementación de la vista `Profile.jsx` en React con lógica completa de edición.
* Carga del usuario desde `/api/users/me` al entrar en la página.
* Componente `AvatarUploader` con gestión de avatar (vista previa, eliminación y restauración según género).
* Modales funcionales:
  * `ChangePasswordModal` con validaciones y errores controlados.
  * `ConfirmDeleteModal` con confirmación textual y cierre de sesión tras eliminación.
* Sincronización automática del contexto global `AuthContext` al modificar perfil o avatar.
* Centralización del `fetchUserFromAPI()` para actualizar el usuario desde cualquier vista.
* Mejora del loader global (`LoaderContext`) para mostrar carga al cambiar de página o enviar formularios.
* Estilos refinados en los formularios y corrección de errores visuales.

### 📝 Observaciones

* El avatar se actualiza correctamente en tiempo real.
* Los cambios se reflejan en el navbar al guardar.
* Se corrigió la ruta de los avatares por defecto.
* Backend y frontend están completamente conectados para el CRUD del perfil.

---

## 🗓️ Día 12 - Jueves 22 de mayo de 2025

### ✅ Tareas realizadas

* Creación y validación del modelo `Board` (pizarras) en Mongoose.
* Creación y validación del modelo `Column` (columnas por pizarra).
* Implementación de los controladores:
  * `boardController.js` con CRUD completo (GET, POST, PUT, DELETE).
  * `columnController.js` con lógica por `boardId` y orden.
* Implementación de rutas protegidas:
  * `boards.routes.js` y `columns.routes.js`, todas con `verifyToken`.
* Registro de nuevas rutas en el servidor principal (`app.js`).
* Homogeneización del estilo de las rutas con `users.routes.js`.
* Estructura clara y escalable para empezar la lógica visual de pizarras y columnas en el frontend.

### 📝 Observaciones

* Todos los endpoints están protegidos por token y listos para Postman o frontend.
* La estructura actual permite extender fácilmente la lógica de tareas (`Task.js`) en una rama futura.
* El proyecto ha consolidado su base de datos y API REST de forma sólida y modular.
* Se decidió dejar la implementación de `Task.js` para una rama independiente (`feature/tasks`).

---

## 🗓️ Día 13 - Viernes 23 de mayo de 2025

### ✅ Tareas realizadas

* Verificación completa en Postman de las rutas de `Board` y `Column`, incluyendo autenticación y control de propiedad.
* Creación de un modal visual (`CreateBoardModal`) para añadir nuevas pizarras desde el frontend.
* Integración del modal de creación en la `Navbar`, visible solo en el dashboard y para usuarios autenticados.
* Ajustes visuales al modal: centrado vertical, fondo opaco, y uso correcto de Bootstrap 5.
* Mejora de la vista de bienvenida del dashboard:
  * Mensaje motivador cuando no hay pizarras.
  * Botón visual llamativo para crear una pizarra.
* Creación del componente `Board.jsx` para renderizar una pizarra seleccionada:
  * Inclusión de `BoardSelector` para cambiar entre pizarras del usuario.
  * Botón "+ Añadir columna" integrado y funcional.
* Creación del modal `CreateColumnModal` con validaciones, orden inicial y conexión a backend por `boardId`.
* Estilizado general de columnas y visualización.
* Implementación de `Column.jsx` y `ColumnList.jsx`:
  * Carga dinámica de columnas por `boardId`.
  * Refresco automático de columnas al añadir una nueva (`refresh` prop).
  * Eliminación del warning de ESLint con `API_BASE_URL`.

### 🐞 Problemas detectados

* El modal de creación de columnas lanza error al conectar con el servidor.
* Probable problema con cómo se está pasando `boardId` entre componentes (`Board → Modal`).
* El botón "+ Añadir columna" no crea correctamente nuevas columnas pese a que el backend está operativo.
* El diseño visual del dashboard necesita mejoras:
  * Falta cohesión visual entre elementos.
  * Las columnas aún no están representadas de forma visual atractiva.
  * Falta espacio adecuado, bordes y color de fondo para delimitar bien la pizarra.

### 📝 Observaciones

* El diseño base y la arquitectura están bien encaminados, pero hay que revisar con calma:
  * Cómo se construye y pasa `boardId` al modal.
  * Cómo se actualiza la lista de columnas tras una nueva creación.
* El estado del frontend es funcional, pero requiere validación lógica y ajustes visuales.
* El próximo paso será resolver los errores del modal de columna y avanzar con las tareas (`Task`).

---

## 🗓️ Día 14 - Sábado 24 de mayo de 2025

### ✅ Tareas realizadas
* Callback `handleBoardCreated` en **Dashboard** → nuevas pizarras aparecen sin recargar.  
* `Layout` y `Navbar` actualizados para propagar `onBoardCreated`.  
* `ColumnList` refactorizado (warning ESLint resuelto, prop `refresh`).  
* Commit guardado: `🐛 fix(navbar & dashboard): propagar creación de boards desde el modal`.

### 📝 Observaciones
* Falta depurar el error del modal **CreateColumn** (problema con `boardId` / URL).  
* Diseño del dashboard necesita pulido (bordes, columnas, cohesión).  
* Próximo paso: arreglar creación de columnas y empezar módulo de tareas con llamada a IA.

---

*(continúa actualizando este documento día a día...)*
