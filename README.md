# 📌 TFG - Taskly

**Taskly** es un proyecto desarrollado como Trabajo de Fin de Grado del ciclo **DAM**. Está construido con el stack MERN (**MongoDB, Express.js, React, Node.js**), utilizando herramientas nativas en macOS 12.7 para garantizar compatibilidad, transparencia y control total del entorno de desarrollo.

---

## 📁 Estructura del Proyecto

```bash
TFG-DAM-JavierABAD/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/        # Imágenes, fuentes, íconos, etc.
│   │   ├── components/    # Componentes reutilizables
│   │   ├── context/       # Contextos globales (AuthContext, etc.)
│   │   ├── hooks/         # Custom hooks (useAuth, etc.)
│   │   ├── pages/         # Páginas principales (Home, Login, etc.)
│   │   ├── services/      # Funciones para llamadas HTTP (fetch/axios)
│   │   ├── utils/         # Funciones auxiliares (formateo, validación)
│   │   ├── styles/        # Estilos globales o comunes
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── README.md
├── DIARIO.md
├── INSTALL.md
├── .gitignore
└── README.md
```

---

## 📌 Objetivos del Proyecto

* 🧠 Desarrollar una aplicación web de gestión de tareas al estilo Trello, simple y funcional.
* 🚀 Aprender a montar un entorno MERN completo de forma nativa.
* 🛠️ Documentar paso a paso el proceso para asegurar reproducibilidad.
* 💡 Mantener la estructura y herramientas más cercanas posible a la documentación oficial de cada tecnología del stack.

---

## 📚 Documentación

* [`INSTALL.md`](./INSTALL.md): guía paso a paso de instalación del entorno en macOS.
* [`DIARIO.md`](./DIARIO.md): diario de trabajo y seguimiento del desarrollo día a día.
* [`backend/README.md`](./backend/README.md): guía técnica del backend (Node.js + Express + MongoDB).
* [`frontend/README.md`](./frontend/README.md): guía técnica del frontend (React).

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

MongoDB ha sido instalado con autenticación activada desde el principio para evitar malas prácticas. La conexión se hace con usuario `admin` y autenticación en la base de datos `admin`. El archivo `.env` gestiona las credenciales y URI de conexión de forma segura.

---

## ✍️ Autor

**Javier Abad del Molino**

Este proyecto forma parte del TFG del ciclo formativo de **Desarrollo de Aplicaciones Multiplataforma (DAM)**.

---

> Todos los archivos `.md` están integrados en el repositorio y versionados con Git para su trazabilidad y evolución.
