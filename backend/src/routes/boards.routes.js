const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard
} = require('../controllers/boardController');

// Obtener todas las pizarras del usuario autenticado
router.get('/', verifyToken, getBoards);

// Crear nueva pizarra
router.post('/', verifyToken, createBoard);

// Actualizar pizarra por ID
router.put('/:id', verifyToken, updateBoard);

// Eliminar pizarra por ID
router.delete('/:id', verifyToken, deleteBoard);

module.exports = router;
