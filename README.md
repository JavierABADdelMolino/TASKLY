# 📌 TFG - Taskly

**Taskly** es un proyecto desarrollado como Trabajo de Fin de Grado del ciclo **DAM**. Está construido con el stack MERN (**MongoDB, Express.js, React, Node.js**), utilizando herramientas nativas en macOS 12.7 para garantizar compatibilidad y transparencia.

---

## 📁 Estructura del Proyecto

```bash
TFG-DAM-JavierABAD/
├── backend/
│   ├── public/   
│   │   └── avatars/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── uploads/   
│   │   └── avatars/
│   └── .env
```bash
TFG-DAM-JavierABAD/
├── backend/
│   ├── public/   
│   │   └── avatars/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── uploads/   
│   │   └── avatars/
│   └── .env
├── frontend/
│   ├── public/                         # Archivos estáticos públicos (favicon, index.html)
│   ├── src/
│   │   ├── assets/                     # Logos, iconos, imágenes, fuentes personalizadas
│   │   ├── components/
│   │   │   ├── dashboard/              # Componentes específicos del panel de tareas (board, columnas, selector)
│   │   │   │   └── modals/             # Modales relacionados con las pizarras y columnas
│   │   │   ├── layout/                 # Componentes generales de estructura como Navbar, Footer, Layout
│   │   │   ├── profile/                # Componentes para la gestión del perfil de usuario
│   │   │   │   └── modals/             # Modales del perfil: editar, cambiar contraseña, eliminar cuenta
│   │   │   ├── auth/                   # Formularios de autenticación (login, registro)
│   │   │   ├── ui/                     # Componentes visuales reutilizables (Loader, ThemeSwitcher, etc.)
│   │   ├── context/                    # Contextos globales de la aplicación (Auth, Theme, Loader)
│   │   ├── hooks/                      # Custom Hooks reutilizables
│   │   ├── pages/                      # Vistas principales de la app (Home, Dashboard, Profile, etc.)
│   │   ├── services/                   # Lógica de conexión con la API (fetch abstraído)
│   │   ├── styles/                     # Estilos globales organizados con SCSS y Bootstrap
│   │   │   ├── base/                   # Estilos base: reset, formularios, tipografía
│   │   │   ├── config/                 # Variables SCSS y configuración de temas
│   │   │   ├── components/             # Estilos específicos de componentes individuales
│   │   │   └── themes/                 # Estilos de tema claro y oscuro con variables CSS
│   │   ├── App.js                      # Componente principal de rutas y layout
│   │   └── index.js                    # Punto de entrada de la app React
│   ├── .env                            # Variables de entorno del frontend
│   └── package.json                    # Dependencias y scripts del proyecto frontend
├── DIARIO.md
├── INSTALL.md
├── .gitignore
├── README.md
└── THEME.md
```

---

## 📌 Objetivos del Proyecto

* 🧠 Desarrollar una aplicación web de gestión de tareas al estilo Trello, simple y funcional.
* 🚀 Aprender a montar un entorno MERN completo de forma nativa.
* 🛠️ Documentar paso a paso el proceso para asegurar reproducibilidad.

---

## 📚 Documentación

* [`INSTALL.md`](./INSTALL.md): guía paso a paso de instalación del entorno en macOS.
* [`DIARIO.md`](./DIARIO.md): diario de trabajo y seguimiento del desarrollo día a día.

---

## 🛠️ Instalación y configuración adicional

- Se añadió la librería `react-icons` para iconos de flecha, estrella e información.

## 💡 Funcionalidades recientes

- CRUD de pizarras, columnas y tareas con modales de creación, edición y eliminación.
- Añadir/quitar favorito en pizarras, con visualización por defecto al cargar el dashboard.
- Reordenamiento de columnas y tareas con flechas de movimiento (próximamente drag&drop).
- Edición y eliminación de pizarras/columnas/tareas directamente desde la UI.
- Popover en hover para ver descripción de la pizarra.
- Orden automático de columnas y tareas gestionado por el backend.
- UX mejorada: cambios de favorito y nuevos elementos reflejados al instante sin recargar.

---

## 🧪 Stack Utilizado

* Node.js 22.15.0
* npm 10.9.2
* MongoDB 7.0.20
* mongosh 2.5.0
* Git 2.15.0
* React (CRA 5.1.0, aunque deprecated, se usa por su sencillez para un primer proyecto)

---

## 🔐 Seguridad

MongoDB ha sido instalado con autenticación activada desde el principio para evitar malas prácticas. La conexión se hace con usuario `admin` y autenticación en la base de datos `admin`.

---

## 🔐 Autenticación

El backend cuenta con autenticación mediante **JWT**:

* Registro de usuarios con contraseña encriptada (`bcrypt`).
* Generación y validación de tokens (`jsonwebtoken`).
* Middleware para proteger rutas privadas.
* Pruebas realizadas con Postman.

---

### 🔑 Autenticación en el Frontend

- El **token JWT** se guarda exclusivamente en `sessionStorage` tras iniciar sesión o registrarse.
- Al recargar la página, si existe un token, el frontend realiza una petición a `/api/auth/me` para obtener los datos del usuario autenticado.
- Si el token no es válido o ha expirado, se elimina automáticamente del almacenamiento y el usuario vuelve al estado no autenticado.
- La sesión se mantiene activa mientras el navegador esté abierto. Cerrar el navegador finaliza la sesión.

---

### 🎨 Sistema de temas (claro/oscuro)

* Implementado 100% con variables CSS (--bs-*) y SCSS ($primary, etc.).
* Soporta personalización de colores desde un único punto.
* Switch dinámico integrado en el Navbar.
* Formularios, modales y botones adaptan colores automáticamente.
* Cambios aplicados a través del atributo data-theme.

---

### 🖼️ Gestión de imágenes de usuario (avatares)

* Las imágenes de perfil se almacenan en la carpeta `backend/uploads/avatars/`, fuera del código fuente (`src/`).
* Express sirve esta ruta como carpeta estática, configurada así en `backend/src/index.js`:
  ```js
  const path = require('path');
  const express = require('express');
  const app = express();

  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  ```
* Al registrarse, los usuarios pueden subir una imagen. Si no lo hacen, se asigna un avatar por defecto.
* Desde el frontend, las imágenes se cargan usando la variable de entorno `REACT_APP_FILES_URL`, definida en el `.env` del frontend:
  ```env
  REACT_APP_FILES_URL=http://localhost:5000
  ```

* Ejemplo de uso en React:
  ```jsx
  <img src={`${process.env.REACT_APP_FILES_URL}${user.avatarUrl}`} alt="Avatar" />
  ```

* Asegúrate de que la carpeta `uploads/` existe y tiene permisos de escritura si estás en producción.

---

### 👤 Gestión del perfil de usuario

Una vez autenticado, el usuario puede:

- Ver su perfil y fecha de registro.
- Editar campos personales (nombre, apellidos, usuario, fecha de nacimiento, género, tema visual).
- Subir, eliminar o restaurar su avatar (asignación automática según género si no se elige imagen).
- Cambiar su contraseña actual con validación.
- Eliminar su cuenta de forma permanente.

Las rutas protegidas del backend (`/api/users`) están aseguradas mediante tokens JWT.

---

## 🧩 Funcionalidad de Pizarras, Columnas y Tareas

### Pizarras (`/api/boards`)
- `GET /` → Obtener todas las pizarras del usuario
- `POST /` → Crear nueva pizarra (requiere `title`)
- `PUT /:id` → Actualizar pizarra (título, descripción)
- `DELETE /:id` → Eliminar pizarra por ID
- `PUT /:id/favorite` → Marcar/desmarcar como favorita exclusiva

### Columnas (`/api/columns`)
- `GET /board/:boardId` → Obtener columnas de una pizarra
- `POST /board/:boardId` → Crear nueva columna en pizarra (solo `title`, el orden se asigna automáticamente)
- `PUT /:id` → Actualizar columna (título, orden)
- `DELETE /:id` → Eliminar columna

### Tareas (`/api/tasks`)
- `GET /columns/:columnId` → Obtener tareas de una columna
- `POST /columns/:columnId` → Crear nueva tarea (solo `title`, `description`, `importance`; el orden se asigna automáticamente)
- `PUT /:id` → Actualizar tarea (título, descripción, importancia, columna, orden)
- `DELETE /:id` → Eliminar tarea

---

## 🚀 Flujo de trabajo con Git

Este proyecto sigue una convención de ramas y commits basada en buenas prácticas dentro del stack MERN.

### 🔀 Estructura de ramas

* `main`: rama principal (estable y lista para presentación).
* `dev`: rama de integración para nuevas funcionalidades.
* `feature/nombre`: ramas individuales para nuevas funcionalidades.
* `bugfix/nombre`: ramas para solucionar errores.
* `docs`: ramas para actualizar documentación.

### 📌 Flujo general

```bash
git checkout -b dev              # Crear rama de desarrollo
git checkout -b feature/login    # Crear rama para nueva funcionalidad
# ... realizar cambios ...
git add .
git commit -m "✨ Añadir login básico"
git checkout dev
git merge feature/login
git push origin dev
```

### ✅ Convención de commits

| Tipo     | Emoji | Ejemplo                             |
| -------- | ----- | ----------------------------------- |
| Nueva    | ✨    | `✨ Añadir vista de tareas`         |
| Fix      | 🐛    | `🐛 Corregir validación de correo`  |
| Docs     | 📝    | `📝 Completar INSTALL.md`           |
| Estilo   | 💄    | `💄 Ajustar diseño del navbar`      |
| Refactor | ♻️    | `♻️ Reorganizar lógica del backend` |
| Infra    | 🔧    | `🔧 Configurar puerto desde .env`   |

---

### ✅ Convención de nombres de archivos

| Tipo de archivo      | Convención de nombre                    | Ejemplo                                  |
| -------------------- | --------------------------------------- | ---------------------------------------- |
| Rutas                | kebab-case, plural, con `.routes.js`    | `auth.routes.js`, `users.routes.js`      |
| Controladores        | camelCase singular con `.controller.js` | `authController.js`, `userController.js` |
| Modelos              | PascalCase singular con `.js`           | `User.js`, `Task.js`                     |
| Middlewares          | camelCase con `.js`                     | `authMiddleware.js`                      |
| Configuración        | camelCase con `.js`                     | `database.js`, `serverConfig.js`         |
| Utilidades / helpers | camelCase con `.js`                     | `generateToken.js`                       |
| Componentes de React | PascalCase con `.jsx` o `.js`           | `LoginForm.jsx`, `TaskCard.js`           |

---

## ✍️ Autor

**Javier Abad del Molino**

Este proyecto forma parte del TFG del ciclo formativo de **Desarrollo de Aplicaciones Multiplataforma (DAM)**.

---

> Todos los archivos `.md` están integrados en el repositorio y versionados con Git.
