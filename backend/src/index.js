require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');

// Rutas
const pingRoutes = require('./routes/ping.routes');
const authRoutes = require('./routes/auth.routes');
const privateRoutes = require('./routes/private.routes');

// Inicializar la app
const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(express.json()); // Para parsear JSON
app.use(cors()); // Habilita CORS para peticiones cross-origin
app.use(morgan('dev')); // Logs de peticiones

// Usar rutas
app.use('/api', pingRoutes); // Monta las rutas bajo /api
app.use('/api', privateRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
