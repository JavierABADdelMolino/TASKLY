require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const connectDB = require('./config/database');
const path = require('path');

// Rutas
const pingRoutes = require('./routes/ping.routes');
const authRoutes = require('./routes/auth.routes');
const privateRoutes = require('./routes/private.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rutas
app.use('/api', pingRoutes);
app.use('/api', privateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Manejo de errores (especialmente para Multer)
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
