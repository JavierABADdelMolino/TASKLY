# TFG – Taskly: Gestión de Tareas con React y Node.js

**Autor**: Nombre Apellidos  
**Tutor/a**: Nombre Tutor/a  
**Grado**: Desarrollo de Aplicaciones Multiplataforma  
**Fecha**: Junio 2025  

---

## Resumen Ejecutivo  
- Descripción breve del sistema y su valor añadido.  
- Objetivos alcanzados: CRUD completo, autenticación JWT, theming, DnD, OpenAI.  
- Tecnologías principales: MongoDB, Express, React, Node.js, SCSS, @dnd-kit, OpenAI.  
- Resultados y métricas clave (rendimiento, usabilidad).  

---

## Índice  
1. Introducción  
2. Marco Teórico y Estado del Arte  
3. Análisis de Requisitos  
4. Diseño de la Solución  
5. Implementación  
6. Pruebas y Calidad del Software  
7. Control de Versiones y Colaboración  
8. Resultados y Conclusiones  
9. Trabajo Futuro  
10. Bibliografía y Referencias  
11. Anexos  

---

## 1. Introducción  
1.1. Contexto y motivación  
 - Problema de gestión de tareas simultáneas.  
 - Limitaciones de herramientas propietarias.  
1.2. Objetivos  
 - Objetivo general.  
 - Objetivos específicos (CRUD, seguridad, theming, DnD, IA, avatar).  
1.3. Alcance  
 - Funcionalidades incluidas y excluidas.  
1.4. Estructura de la memoria  

## 2. Marco Teórico y Estado del Arte  
2.1. Metodologías Kanban  
 - Principios y beneficios.  
 - Herramientas líderes: Trello, Asana, Jira.  
2.2. Arquitectura full-stack JavaScript (MERN)  
 - Ventajas de homogeneidad JS.  
 - Ecosistema y herramientas.  
2.3. Drag & Drop en interfaces web  
 - Bibliotecas populares (React DnD, @dnd-kit).  
 - Experiencia de usuario.  
2.4. Theming y accesibilidad  
 - Uso de CSS variables y SCSS modular.  
 - Contraste y normativa WCAG.  
2.5. Integración de IA  
 - API de OpenAI: casos de uso en productividad.  
 - Privacidad y consideraciones éticas.  

## 3. Análisis de Requisitos  
3.1. Requisitos funcionales  
 - Gestión de tableros, columnas, tareas.  
 - Autenticación/Autorización JWT.  
 - Temas claro/oscuro.  
 - Sugerencia de prioridad con OpenAI.  
 - Subida y edición de avatar.  
3.2. Requisitos no funcionales  
 - Seguridad (CORS, Helmet, HTTPS).  
 - Rendimiento y escalabilidad.  
 - Usabilidad y accesibilidad.  
 - Mantenibilidad y extensibilidad.  
3.3. Casos de uso y diagramas UML  
 - Diagrama de casos de uso global.  
 - Flujos de interacción clave (login, CRUD, DnD).  

## 4. Diseño de la Solución  
4.1. Arquitectura Cliente–Servidor  
 - Diagrama de componentes y capas.  
 - Flujo de datos HTTP/REST.  
4.2. Modelado de Datos en MongoDB  
 - Diagrama ER.  
 - Esquemas: boards, columns, tasks, users.  
4.3. Diseño de la API REST  
 - Endpoints principales con ejemplos JSON.  
 - Gestión de errores y códigos de respuesta.  
4.4. Organización del Código  
 - Backend: `/controllers`, `/models`, `/routes`, `/middlewares`.  
 - Frontend: `/components`, `/services`, `/styles`, `/contexts`.  
4.5. Diseño de la Interfaz de Usuario  
 4.5.1. Wireframes y prototipos iniciales  
 4.5.2. Capturas de pantalla  
  - Lista de tableros (`docs/screenshots/board-list.png`)  
  - Tablero Kanban (`docs/screenshots/kanban-board.png`)  
  - Modal de tarea (`docs/screenshots/task-modal.png`)  
  - Vista en responsive (`docs/screenshots/mobile-view.png`)  
4.6. Sistema de Estilos y Temas  
 - Estructura SCSS: `config/`, `base/`, `themes/`, `components/`.  
 - Variables CSS y React ThemeContext.  

## 5. Implementación  
5.1. Backend (Node.js + Express)  
 - Configuración de servidor y middlewares (CORS, Helmet, rate limit).  
 - Rutas de autenticación y CRUD.  
 - Lógica de controladores y validaciones.  
5.2. Integración OpenAI  
 - Servicio de llamadas y prompt engineering.  
 - Procesamiento de respuestas y asignación de `suggestedImportance`.  
5.3. Frontend (React + @dnd-kit)  
 - Estructura de componentes y Context API (Auth, Theme).  
 - Drag & Drop de columnas (`useSortable`) y tareas (`useDraggable`, `useDroppable`).  
 - Hooks personalizados (`useAuth`, `useTasks`).  
 - AvatarUploader y gestión de archivos.  
5.4. Servicios REST y gestión de estado  
 - `authService`, `boardService`, `columnService`, `taskService`.  
 - Sincronización con backend y manejo de errores.  
5.5. Gestión de Assets y SCSS  
 - Punto de entrada `styles/index.scss`.  
 - Partial files y carga en `App.js`.  

## 6. Pruebas y Calidad del Software  
6.1. Pruebas manuales con Postman  
 - Colección de requests y validación de flujos.  
6.2. Pruebas en entorno de producción  
 - Verificación de funcionalidades tras `npm run build`.  
6.3. Plan de pruebas automatizadas (futuro)  
 - Herramientas propuestas: Jest, React Testing Library, Cypress.  
6.4. Herramientas de calidad de código  
 - ESLint, Prettier y análisis estático.  

## 7. Control de Versiones y Colaboración  
7.1. GitHub Flow y convenciones de ramas  
 - `main`, `dev`, `feature/...`, `bugfix/...`, `docs/...`.  
7.2. Pull Requests y revisión de código  
 - Plantillas de PR y checklist de revisión.  
7.3. Guía de contribución (`CONTRIBUTING.md`)  
 - Cómo crear ramas, enviar PR y etiquetar issues.  

## 8. Resultados y Conclusiones  
8.1. Evaluación del cumplimiento de objetivos  
8.2. Análisis de rendimiento y usabilidad  
8.3. Principales aprendizajes y mejoras incorporadas  

## 9. Trabajo Futuro  
- Automatización del build y optimización de assets  
- Despliegue automatizado (Heroku, Netlify, Vercel)  
- Integración continua con GitHub Actions  
- Pruebas unitarias e2e completas  
- Monitorización y logging en producción  
- Internacionalización (i18n)  
- Versión móvil nativa (React Native)  

## 10. Bibliografía y Referencias  
- Documentación oficial: React, Express, Mongoose, @dnd-kit, OpenAI  
- Artículos y libros sobre Kanban, UX y accesibilidad  
- Guías de SCSS y theming  

## 11. Anexos  
- Diagramas UML completos (PDF)  
- Export Postman Collection (`docs/collections/postman.json`)  
- Capturas de pantalla adicionales (`docs/screenshots/`)  
- Ejemplo de archivo `.env.example`  
```  