require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const connectDB = require('./config/database');
const path = require('path');
const fs = require('fs');

const app = express();

// 📡 Conectar a la base de datos
connectDB();

// 🧩 Middlewares globales
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Ruta de uploads: usa env var solo en producción o carpeta uploads en desarrollo
const UPLOADS_PATH = process.env.NODE_ENV === 'production'
  ? process.env.UPLOADS_PATH
  : path.join(__dirname, '..', 'uploads');
// Crear carpeta local de uploads solo en desarrollo
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH, { recursive: true });
}
// 📂 Servir archivos estáticos de uploads (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(UPLOADS_PATH));
}
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// 🔗 Importar rutas
const pingRoutes = require('./routes/ping.routes');
const authRoutes = require('./routes/auth.routes');
const privateRoutes = require('./routes/private.routes');
const userRoutes = require('./routes/user.routes');
const boardRoutes = require('./routes/board.routes');
const columnRoutes = require('./routes/column.routes');
const taskRoutes = require('./routes/task.routes');

// 🚦 Usar rutas
app.use('/api/ping', pingRoutes);
app.use('/api/private', privateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes);

// ⚠️ Manejo de errores (especialmente para Multer)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'Error al subir el archivo: ' + err.message });
  }

  if (err.message && err.message.includes('Solo se permiten archivos')) {
    return res.status(400).json({ message: err.message });
  }

  console.error('Error inesperado:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// 🚀 Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
