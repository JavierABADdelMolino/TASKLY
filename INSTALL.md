# 🛠️ Guía de Instalación - Proyecto Taskly

Bienvenido a **Taskly**, un proyecto desarrollado con el stack **MERN** (MongoDB, Express, React, Node.js). Esta guía proporciona los pasos detallados para preparar el entorno de desarrollo en macOS de forma nativa, segura y compatible con versiones Tier 3 como macOS 12.7.

---

## 📋 Requisitos del sistema

* macOS 12.7 (Monterey)
* Terminal con Zsh o Bash
* Conexión a internet estable

---

## 📦 Instalación de herramientas base

### 1. Homebrew

Instala Homebrew (si no está instalado) con el siguiente comando:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Git, Node.js, npm y npx

Instala Git y Node.js desde Homebrew:

```bash
brew install git node
```

Verifica las versiones instaladas:

```bash
brew --version
node -v
npm -v
npx --version
git --version
```

---

## 🗄️ Instalación de MongoDB Community Edition

### 1. Agrega el repositorio de MongoDB a Homebrew

```bash
brew tap mongodb/brew
```

### 2. Instala MongoDB

```bash
brew install mongodb-community@7.0
```

### 3. Inicia el servicio de MongoDB

```bash
brew services start mongodb/brew/mongodb-community@7.0
```

### 4. Agrega MongoDB al PATH (si es necesario)

```bash
echo 'export PATH="/usr/local/opt/mongodb-community@7.0/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

---

## 🔐 Activar autenticación en MongoDB

### 1. Editar archivo de configuración

```bash
nano /usr/local/etc/mongod.conf
```

Agrega esta sección al final del archivo:

```yaml
security:
  authorization: enabled
```

### 2. Reinicia el servicio

```bash
brew services restart mongodb/brew/mongodb-community@7.0
```

### 3. Crear un usuario administrador

Abre mongosh:

```bash
mongosh
```

Dentro de mongosh ejecuta:

```javascript
use admin

db.createUser({
  user: "admin",
  pwd: "claveSegura123",
  roles: [ { role: "root", db: "admin" } ]
})
```

### 4. Conexión autenticada

```bash
mongosh -u admin -p --authenticationDatabase admin
```

---

## 🔌 Conexión a MongoDB desde Visual Studio Code

### 1. Instalar la extensión oficial

* Abre Visual Studio Code.
* Ve a la pestaña de extensiones (`⌘ + Shift + X`).
* Busca `MongoDB for VS Code` e instálala.

### 2. Abrir el panel de conexión

* Haz clic en el ícono de MongoDB en la barra lateral izquierda.
* O abre el explorador con `⌘ + Shift + P` → `MongoDB: Open Connection Explorer`.

### 3. Añadir conexión manual

* Clic en **"Add Connection"**.
* Introduce la URI:

```bash
mongodb://admin:claveSegura123@127.0.0.1:27017/TFG-DAM-JavierABAD?authSource=admin
```

* Ponle un nombre como `Taskly Local` y guarda la conexión.

---

## 🌐 Publicación del proyecto en GitHub desde Visual Studio Code

Si ya has inicializado el repositorio local de Git, puedes publicarlo directamente en GitHub desde Visual Studio Code:

### 🧩 Pasos desde Visual Studio Code

1. Abre Visual Studio Code en la raíz del proyecto.
2. Haz clic en el icono de **Control de Código Fuente** (ícono de ramita) en la barra lateral izquierda.
3. Haz clic en los tres puntos `⋯` en la esquina superior derecha del panel de Git.
4. Selecciona la opción **Publish to GitHub...**.
5. Autoriza tu cuenta de GitHub si es la primera vez.
6. Elige el nombre del repositorio (o déjalo por defecto).
7. Espera a que Visual Studio Code cree el repositorio y realice el primer push automáticamente.

> 📦 Esto conecta tu proyecto local con GitHub y sube el contenido al repositorio remoto en la rama `main`.

---

## ✅ Verificación final del entorno

Ejecuta los siguientes comandos para comprobar que todo está correctamente instalado:

```bash
node -v
npm -v
npx --version
git --version
mongod --version
mongosh --version
```

---

## 📁 Estructura base del proyecto

```bash
TFG-DAM-JavierABAD/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── uploads/   
│   │   └── images/
│   ├── .env
│   └── .gitignore
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/           # Logos, iconos, imágenes, fuentes
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer, Layout general
│   │   │   ├── auth/         # Formularios de login y registro
│   │   │   ├── ui/           # Loader, ThemeSwitcher, etc.
│   │   ├── context/          # AuthContext, ThemeContext, LoaderContext
│   │   ├── hooks/            # Custom Hooks
│   │   ├── pages/            # Home, Dashboard, etc.
│   │   ├── services/         # Lógica de comunicación HTTP (fetch)
│   │   ├── styles/           # Estilos globales con SCSS y Bootstrap
│   │   │   ├── base/         # Reset, formularios
│   │   │   ├── config/       # Variables SCSS
│   │   │   ├── components/   # Estilos de componentes específicos
│   │   │   └── themes/       # Tema claro y oscuro
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── DIARIO.md
├── INSTALL.md
├── .gitignore
├── README.md
└── THEME.md
```

---

> Este archivo forma parte de la documentación técnica del Trabajo de Fin de Grado y quedará versionado dentro del repositorio oficial de Taskly.
