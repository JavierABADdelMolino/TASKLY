# 📌 TFG - Taskly

**Taskly** es un proyecto desarrollado como Trabajo de Fin de Grado del ciclo **DAM**. Está construido con el stack MERN (**MongoDB, Express.js, React, Node.js**), utilizando herramientas nativas para garantizar compatibilidad y transparencia.

Es una aplicación web de gestión de tareas al estilo Kanban, que permite a los usuarios organizar sus proyectos mediante tableros personalizables con columnas y tareas drag & drop.

---

## 🚀 Características principales

- ✅ **Gestión de tableros Kanban** con columnas y tareas drag & drop
- 🔐 **Autenticación completa** (registro, login, Google OAuth, recuperación de contraseña)
- 👤 **Gestión de perfil** (edición, avatar, configuración de tema)
- 🎨 **Sistema de temas** claro/oscuro con variables CSS
- 🤖 **Sugerencias de IA** para priorizar tareas usando OpenAI
- 📧 **Sistema de emails** transaccionales con plantillas HTML
- 📱 **Responsive design** adaptado a móviles y tablets
- ☁️ **Almacenamiento en la nube** con Cloudinary para avatares
- 🔔 **Notificaciones en tiempo real** para acciones importantes
- 📊 **Gestión de tareas avanzada** con fechas límite, prioridades e importancia

---

## 📁 Estructura del Proyecto

### Backend

```bash
TFG-DAM-JavierABAD/backend/
├── public/                         # Avatares por defecto
│   └── avatars/
│       ├── default-avatar-female.png
│       └── default-avatar-male.png
├── src/
│   ├── config/
│   │   └── database.js             # Conexión a MongoDB
│   ├── controllers/
│   │   ├── authController.js       # Autenticación y registro
│   │   ├── userController.js       # Gestión de perfil
│   │   ├── boardController.js      # Tableros Kanban
│   │   ├── columnController.js     # Columnas de tableros
│   │   ├── taskController.js       # Tareas y drag & drop
│   │   └── contactController.js    # Formulario de contacto
│   ├── middlewares/
│   │   ├── authMiddleware.js       # Verificación JWT
│   │   ├── avatarMiddleware.js     # Subida de avatares
│   │   ├── boardOwnershipMiddleware.js
│   │   ├── columnOwnershipMiddleware.js
│   │   └── taskOwnershipMiddleware.js
│   ├── models/
│   │   ├── User.js                 # Modelo de usuario
│   │   ├── Board.js                # Modelo de tablero
│   │   ├── Column.js               # Modelo de columna
│   │   └── Task.js                 # Modelo de tarea
│   ├── routes/
│   │   ├── auth.routes.js          # Rutas de autenticación
│   │   ├── user.routes.js          # Rutas de perfil
│   │   ├── board.routes.js         # Rutas de tableros
│   │   ├── column.routes.js        # Rutas de columnas
│   │   ├── task.routes.js          # Rutas de tareas
│   │   ├── contact.routes.js       # Ruta de contacto
│   │   ├── ping.routes.js          # Health check
│   │   └── private.routes.js       # Rutas protegidas
│   ├── services/
│   │   ├── nodemailerService.js    # Emails transaccionales
│   │   └── cloudinaryService.js    # Gestión de imágenes
│   └── index.js                    # Servidor principal
├── uploads/                        # Avatares subidos (desarrollo)
│   └── avatars/
└── .env                           # Variables de entorno
```

### Frontend

```bash
TFG-DAM-JavierABAD/frontend/
├── public/                         # Archivos estáticos públicos
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   ├── _redirects                  # Para Netlify/Render SPA
│   ├── favicon.ico
│   ├── logo-text.svg               # Logo principal
│   ├── logo-240x92.png             # Logo para emails
│   └── assets/                     # Imágenes y recursos
├── src/
│   ├── components/
│   │   ├── auth/                   # Componentes de autenticación
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   ├── ResetPasswordForm.jsx
│   │   │   └── AuthModal.jsx
│   │   ├── dashboard/              # Panel de tareas Kanban
│   │   │   ├── BoardSelector.jsx
│   │   │   ├── Board.jsx
│   │   │   ├── Column.jsx
│   │   │   ├── Task.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── modals/
│   │   │       ├── CreateBoardModal.jsx
│   │   │       ├── CreateColumnModal.jsx
│   │   │       ├── CreateTaskModal.jsx
│   │   │       ├── EditBoardModal.jsx
│   │   │       ├── EditColumnModal.jsx
│   │   │       └── EditTaskModal.jsx
│   │   ├── layout/                 # Estructura general
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── profile/                # Gestión de perfil
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── AvatarUpload.jsx
│   │   │   └── modals/
│   │   │       ├── EditProfileModal.jsx
│   │   │       ├── ChangePasswordModal.jsx
│   │   │       └── DeleteAccountModal.jsx
│   │   └── ui/                     # Componentes reutilizables
│   │       ├── Loader.jsx
│   │       ├── ThemeSwitcher.jsx
│   │       ├── ConfirmationModal.jsx
│   │       └── Toast.jsx
│   ├── context/                    # Contextos globales
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   └── LoaderContext.js
│   ├── hooks/                      # Custom Hooks
│   │   ├── useApi.js
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   └── useLoader.js
│   ├── pages/                      # Vistas principales
│   │   ├── Home.jsx                # Landing page
│   │   ├── Dashboard.jsx           # Panel de tableros
│   │   ├── Profile.jsx             # Perfil de usuario
│   │   ├── NotFound.jsx            # Error 404
│   │   └── corporate/
│   │       ├── AboutPage.jsx
│   │       ├── ContactPage.jsx
│   │       └── PrivacyPage.jsx
│   ├── services/                   # Conexión con API
│   │   ├── apiService.js           # Cliente HTTP base
│   │   ├── authService.js          # Servicios de auth
│   │   ├── userService.js          # Servicios de usuario
│   │   ├── boardService.js         # Servicios de tableros
│   │   ├── columnService.js        # Servicios de columnas
│   │   └── taskService.js          # Servicios de tareas
│   ├── styles/                     # Estilos SCSS organizados
│   │   ├── base/                   # Estilos base
│   │   │   ├── _reset.scss
│   │   │   └── _typography.scss
│   │   ├── config/                 # Variables y configuración
│   │   │   ├── _variables.scss
│   │   │   └── _mixins.scss
│   │   ├── components/             # Estilos de componentes
│   │   │   ├── _buttons.scss
│   │   │   ├── _forms.scss
│   │   │   ├── _cards.scss
│   │   │   ├── _modals.scss
│   │   │   ├── _navbar.scss
│   │   │   ├── _footer.scss
│   │   │   └── _kanban.scss
│   │   ├── themes/                 # Definiciones de temas
│   │   │   ├── _light-theme.scss
│   │   │   └── _dark-theme.scss
│   │   └── index.scss              # Punto de entrada principal
│   ├── utils/                      # Utilidades
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── App.js                      # Componente principal
│   └── index.js                    # Punto de entrada React
├── .env                           # Variables de entorno
└── package.json                   # Dependencias y scripts
```

---

## 🛠️ Tecnologías utilizadas

### Backend
- **Node.js** 22.15.0 - Runtime de JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** 7.0.20 - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **bcrypt** - Encriptación de contraseñas
- **Multer** - Subida de archivos
- **Cloudinary** - Almacenamiento de imágenes en la nube
- **Nodemailer** - Envío de emails
- **Express Validator** - Validación de datos
- **CORS** - Configuración de acceso entre dominios

### Frontend
- **React** 18 - Librería de interfaz de usuario
- **React Router** - Enrutamiento del lado cliente
- **Bootstrap** 5 - Framework CSS
- **SCSS** - Preprocesador CSS
- **React Icons** - Librería de iconos
- **@dnd-kit** - Drag and drop nativo para React
- **React Bootstrap** - Componentes Bootstrap para React
- **Axios** - Cliente HTTP para APIs

### Servicios externos
- **MongoDB Atlas** - Base de datos en la nube
- **Cloudinary** - Gestión de imágenes
- **OpenAI API** - Sugerencias de IA para tareas
- **Google OAuth** - Autenticación con Google
- **Render** - Hosting para backend y frontend
- **Hostinger** - Dominio y correos corporativos

---

## 🔐 Autenticación y Seguridad

### Sistema de autenticación
- **Registro** con email/contraseña o Google OAuth
- **Login** tradicional y social (Google)
- **JWT tokens** con expiración configurable
- **Recuperación de contraseña** por email
- **Verificación de email** para nuevos usuarios
- **Protección CSRF** y validación de entrada

### Gestión de sesiones
- Token JWT almacenado en `sessionStorage`
- Verificación automática al cargar la aplicación
- Renovación automática de tokens próximos a expirar
- Logout automático en caso de token inválido
- Persistencia de sesión durante navegación

### Seguridad de datos
- Contraseñas encriptadas con bcrypt (12 rounds)
- Validación de entrada en frontend y backend
- Sanitización de datos antes de guardar en BD
- Protección contra inyección NoSQL
- Headers de seguridad HTTP configurados
- Rate limiting para prevenir ataques de fuerza bruta

---

## 📊 Funcionalidades principales

### 🏗️ Gestión de tableros Kanban
- **Crear tableros** personalizados con título y descripción
- **Marcar tableros favoritos** para acceso rápido
- **Editar y eliminar** tableros existentes
- **Compartir tableros** entre usuarios (futuro)

### 📋 Sistema de columnas
- **Crear columnas** dentro de cada tablero
- **Reordenar columnas** mediante drag & drop
- **Personalizar títulos** y orden de columnas
- **Eliminar columnas** vacías o mover tareas antes

### ✅ Gestión avanzada de tareas
- **Crear tareas** con título, descripción y fecha límite
- **Establecer prioridad** (Baja, Normal, Alta, Urgente)
- **Sugerencias de IA** para importancia basada en contenido
- **Mover tareas** entre columnas con drag & drop
- **Fechas límite** con alertas visuales para tareas vencidas
- **Reordenar tareas** dentro de cada columna
- **Editar y eliminar** tareas existentes

### 🤖 Integración con IA
- **OpenAI API** para sugerir prioridad de tareas
- **Análisis automático** del contenido de las tareas
- **Sugerencias contextuales** basadas en fechas límite
- **Prefetch de sugerencias** para mejor UX

### 👤 Gestión de perfil
- **Editar información** personal (nombre, apellidos, fecha nacimiento)
- **Subir avatar** personalizado o usar avatares por defecto
- **Cambiar contraseña** con validación de seguridad
- **Eliminar cuenta** permanentemente
- **Configuración de tema** (claro/oscuro)
- **Vinculación con Google** para cuentas existentes

### 🎨 Sistema de temas
- **Tema claro/oscuro** con cambio dinámico
- **Variables CSS** personalizables (--bs-*)
- **Persistencia** de preferencias en localStorage
- **Adaptación automática** de todos los componentes
- **Transiciones suaves** entre temas

### 📧 Sistema de emails
- **Emails de bienvenida** personalizados por tipo de registro
- **Recuperación de contraseña** con enlaces seguros
- **Notificaciones** de cambios importantes
- **Plantillas HTML** responsive con branding
- **Diferentes proveedores** (Nodemailer, Resend)

---

## 🚀 Instalación y configuración

### Prerrequisitos
- Node.js 18+ 
- MongoDB 6+ (local o Atlas)
- Git
- npm o yarn

### Instalación local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/TFG-DAM-JavierABAD.git
   cd TFG-DAM-JavierABAD
   ```

2. **Configurar el backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Editar .env con tus variables
   npm run dev
   ```

3. **Configurar el frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Editar .env con tus variables
   npm start
   ```

### Variables de entorno

#### Backend (.env)
```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb://localhost:27017/taskly

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# URLs
FRONTEND_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000

# Cloudinary (imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# OpenAI (opcional)
OPENAI_API_KEY=tu_openai_api_key

# Email
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=noreply@taskly.es
EMAIL_PASSWORD=tu_password
EMAIL_FROM=noreply@taskly.es
SUPPORT_EMAIL=support@taskly.es
```

#### Frontend (.env)
```env
# API
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FILES_URL=http://localhost:5000

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=tu_google_client_id

# Características opcionales
REACT_APP_ENABLE_AI_SUGGESTIONS=true
REACT_APP_ENABLE_GOOGLE_AUTH=true
```

---

## 📚 API Reference

### Autenticación
```
POST /api/auth/register          # Registro con email/password
POST /api/auth/login             # Login tradicional  
POST /api/auth/google            # Login/registro con Google
POST /api/auth/forgot-password   # Solicitar reset de password
POST /api/auth/reset-password    # Confirmar reset de password
GET  /api/auth/me               # Obtener usuario actual
POST /api/auth/logout           # Cerrar sesión
```

### Usuarios
```
GET    /api/users/profile       # Obtener perfil
PUT    /api/users/profile       # Actualizar perfil
POST   /api/users/avatar        # Subir avatar
DELETE /api/users/avatar        # Eliminar avatar
PUT    /api/users/password      # Cambiar contraseña
DELETE /api/users/account       # Eliminar cuenta
POST   /api/users/link-google   # Vincular cuenta con Google
```

### Tableros
```
GET    /api/boards              # Listar tableros del usuario
POST   /api/boards              # Crear nuevo tablero
GET    /api/boards/:id          # Obtener tablero específico
PUT    /api/boards/:id          # Actualizar tablero
DELETE /api/boards/:id          # Eliminar tablero
PUT    /api/boards/:id/favorite # Marcar/desmarcar favorito
```

### Columnas
```
GET    /api/columns/board/:boardId # Listar columnas de tablero
POST   /api/columns/board/:boardId # Crear columna en tablero
PUT    /api/columns/:id            # Actualizar columna
DELETE /api/columns/:id            # Eliminar columna
PUT    /api/columns/reorder        # Reordenar columnas
```

### Tareas
```
GET    /api/tasks/column/:columnId # Listar tareas de columna
POST   /api/tasks/column/:columnId # Crear tarea en columna
GET    /api/tasks/:id              # Obtener tarea específica
PUT    /api/tasks/:id              # Actualizar tarea
DELETE /api/tasks/:id              # Eliminar tarea
PUT    /api/tasks/:id/move         # Mover tarea entre columnas
PUT    /api/tasks/reorder          # Reordenar tareas
POST   /api/tasks/:id/ai-suggest   # Obtener sugerencia de IA
```

### Otros
```
POST /api/contact                # Enviar mensaje de contacto
GET  /api/ping                   # Health check
```

---

## 🎯 Roadmap y funcionalidades futuras

### Próximas funcionalidades
- [ ] **Colaboración en tiempo real** - WebSockets para múltiples usuarios
- [ ] **Comentarios en tareas** - Sistema de comentarios y menciones
- [ ] **Archivos adjuntos** - Subida de documentos a tareas
- [ ] **Notificaciones push** - Alertas de navegador y email
- [ ] **Etiquetas y filtros** - Sistema de categorización avanzado
- [ ] **Métricas y reportes** - Dashboard de productividad
- [ ] **API pública** - Integración con herramientas externas
- [ ] **App móvil** - Versión nativa para iOS/Android
- [ ] **Exportación de datos** - Backup en JSON/CSV
- [ ] **Integraciones** - Slack, Trello, Calendar, etc.

### Mejoras técnicas
- [ ] **Tests automatizados** - Jest, Cypress, Testing Library
- [ ] **CI/CD pipeline** - GitHub Actions o similar
- [ ] **Monitorización** - Logging, métricas, alertas
- [ ] **CDN para assets** - Optimización de carga
- [ ] **PWA** - Soporte offline y instalación
- [ ] **GraphQL** - API más eficiente para móvil
- [ ] **Microservicios** - Separación de responsabilidades
- [ ] **Redis** - Cache y sesiones distribuidas

---

## 🧪 Testing

El proyecto incluye diferentes tipos de tests:

### Backend
```bash
npm run test              # Tests unitarios
npm run test:integration  # Tests de integración  
npm run test:e2e         # Tests end-to-end
npm run test:coverage    # Cobertura de código
```

### Frontend
```bash
npm test                 # Tests con Jest
npm run test:coverage    # Cobertura del frontend
npm run cypress:open     # Tests E2E con Cypress
```

---

## 🚀 Despliegue

Para información detallada sobre el despliegue en producción, consulta [`DEPLOY.md`](./DEPLOY.md).

### Servicios utilizados
- **Render** - Hosting para backend y frontend
- **MongoDB Atlas** - Base de datos en la nube
- **Cloudinary** - Gestión de imágenes
- **Hostinger** - Dominio y correos corporativos

### URLs de producción
- **Frontend**: https://taskly.es
- **Backend API**: https://api.taskly.es
- **Documentación**: https://docs.taskly.es (futuro)

---

## 📝 Documentación adicional

- [`INSTALL.md`](./INSTALL.md) - Guía detallada de instalación en macOS
- [`DEPLOY.md`](./DEPLOY.md) - Proceso completo de despliegue
- [`DIARIO.md`](./DIARIO.md) - Diario de desarrollo día a día
- [`THEME.md`](./THEME.md) - Sistema de temas y estilos
- [`API.md`](./API.md) - Documentación completa de la API (futuro)

---

## 🤝 Contribuir

Aunque este es un proyecto académico (TFG), las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convención de commits
- ✨ `feat:` nueva funcionalidad
- 🐛 `fix:` corrección de bugs
- 📝 `docs:` documentación
- 💄 `style:` estilos y UI
- ♻️ `refactor:` refactorización
- 🧪 `test:` tests
- 🔧 `chore:` tareas de mantenimiento

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [`LICENSE`](./LICENSE) para más detalles.

---

## ✍️ Autor

**Javier Abad del Molino**
- GitHub: [@javierabaddelm](https://github.com/javierabaddelm)
- Email: javierabaddaroca@gmail.com
- LinkedIn: [Javier Abad](https://linkedin.com/in/javierabaddelm)

---

## 🙏 Agradecimientos

- **IES Al-Ándalus** - Centro educativo donde se desarrolló este TFG
- **MongoDB University** - Por los cursos y recursos gratuitos
- **React Community** - Por la excelente documentación
- **Stack Overflow** - Por resolver dudas técnicas
- **OpenAI** - Por las capacidades de IA integradas

---

> Este proyecto forma parte del TFG del ciclo formativo de **Desarrollo de Aplicaciones Multiplataforma (DAM)** 2024-2025.

**🌟 ¡Si te gusta el proyecto, dale una estrella!**
