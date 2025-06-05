# 🛠️ Guía de Instalación - Proyecto Taskly

Bienvenido a **Taskly**, un gestor de tareas desarrollado con el stack **MERN** (MongoDB, Express, React, Node.js). Sigue esta guía para configurar el entorno de desarrollo.

---

## 📋 Requisitos del Sistema

- macOS 12.7 (Monterey)
- Terminal con Zsh o Bash
- Conexión a internet estable

---

## 📦 Instalación de Herramientas Base

### 1. Instalar Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Instalar Git y Node.js

```bash
brew install git node
```

Verifica las versiones:

```bash
brew --version
node -v
npm -v
git --version
```

---

## 🗄️ Configuración de MongoDB

### 1. Instalar MongoDB

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

### 2. Activar Autenticación

Edita el archivo de configuración:

```bash
nano /usr/local/etc/mongod.conf
```

Agrega:

```yaml
security:
  authorization: enabled
```

Reinicia el servicio:

```bash
brew services restart mongodb/brew/mongodb-community@7.0
```

### 3. Crear Usuario Administrador

```bash
mongosh
```

Dentro de `mongosh`:

```javascript
use admin

db.createUser({
  user: "admin",
  pwd: "claveSegura123",
  roles: [ { role: "root", db: "admin" } ]
})
```

---

## 🔌 Conexión a MongoDB desde Visual Studio Code

1. Instala la extensión oficial `MongoDB for VS Code`.
2. Configura la conexión con la URI:

```bash
mongodb://admin:claveSegura123@127.0.0.1:27017/TFG-DAM-JavierABAD?authSource=admin
```

---

## 🌐 Configuración de OpenAI API

1. Registra una cuenta en OpenAI y genera una clave API.
2. Agrega la clave al archivo `.env`:

```env
OPENAI_API_KEY=tu_clave_api
```

3. Instala la dependencia:

```bash
npm install openai
```

---

## 💻 Instalación del Proyecto

1. Clona el repositorio y entra en la carpeta del proyecto:
   ```bash
   git clone <url-del-repo>
   cd TFG-DAM-JavierABAD
   ```
2. Instala dependencias del backend:
   ```bash
   cd backend
   npm install
   ```
3. Instala dependencias del frontend (incluye SCSS y react-icons):
   ```bash
   cd ../frontend
   npm install
   npm install sass react-icons react-bootstrap bootstrap
   ```

   - Estructura de estilos reorganizada: SCSS en `src/styles` con subcarpetas `base/`, `config/`, `components/`, `themes/`.
   - Reorganización de assets de logos en `public/logos` y actualización de `manifest.json` e `index.html` con nuevos favicons e íconos PWA.
   - Importa estilos principales en `src/index.js` reemplazando `import './styles/theme.scss'` por `import './styles/index.scss'`.

4. Duplica y configura variables de entorno:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   A continuación un ejemplo de contenidos para cada `.env.example`:

   ```dotenv
   # backend/.env.example
   MONGODB_URI=mongodb://admin:claveSegura123@127.0.0.1:27017/TFG-DAM-JavierABAD?authSource=admin
   JWT_SECRET=tu_secreto_jwt
   OPENAI_API_KEY=tu_clave_api

   # frontend/.env.example
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_FILES_URL=http://localhost:5000
   ```

---

## ✅ Verificación Final

Ejecuta:

```bash
node -v
npm -v
mongod --version
mongosh --version
```

---

> Este archivo forma parte de la documentación técnica del Trabajo de Fin de Grado y quedará versionado dentro del repositorio oficial de Taskly.
