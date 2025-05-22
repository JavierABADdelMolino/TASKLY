// routes/columns.routes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const {
  getColumnsByBoard,
  createColumn,
  updateColumn,
  deleteColumn
} = require('../controllers/columnController');

// Obtener columnas de una pizarra específica
router.get('/:boardId', verifyToken, getColumnsByBoard);

// Crear nueva columna en una pizarra
router.post('/:boardId', verifyToken, createColumn);

// Actualizar una columna por ID
router.put('/:id', verifyToken, updateColumn);

// Eliminar una columna por ID
router.delete('/:id', verifyToken, deleteColumn);

module.exports = router;
