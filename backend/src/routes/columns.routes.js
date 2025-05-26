const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require('../middlewares/authMiddleware');
const verifyBoardOwnership = require('../middlewares/boardOwnershipMiddleware');
const verifyColumnOwnership = require('../middlewares/columnOwnershipMiddleware');

// Controladores
const {
  getColumnsByBoard,
  getColumnById,
  createColumn,
  updateColumn,
  deleteColumn
} = require('../controllers/columnController');

// GET /api/columns/board/:boardId - Obtener columnas de una pizarra específica
router.get('/board/:boardId', verifyToken, verifyBoardOwnership, getColumnsByBoard);

// GET /api/columns/:id - Obtener una columna por ID (con protección)
router.get('/:id', verifyToken, verifyColumnOwnership, getColumnById);

// POST /api/columns/board/:boardId - Crear nueva columna en una pizarra
router.post('/board/:boardId', verifyToken, verifyBoardOwnership, createColumn);

// PUT /api/columns/:id - Actualizar una columna por ID
router.put('/:id', verifyToken, verifyColumnOwnership, updateColumn);

// DELETE /api/columns/:id - Eliminar una columna por ID
router.delete('/:id', verifyToken, verifyColumnOwnership, deleteColumn);

module.exports = router;
