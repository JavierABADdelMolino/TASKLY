const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const verifyBoardOwnership = require('../middlewares/boardOwnershipMiddleware');
const {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  setFavorite
} = require('../controllers/boardController');

// Obtener todas las pizarras del usuario autenticado
router.get('/', verifyToken, getBoards);

// Obtener una pizarra concreta por ID (si pertenece al usuario)
router.get('/:id', verifyToken, verifyBoardOwnership, getBoardById);

// Crear nueva pizarra
router.post('/', verifyToken, createBoard);

// Actualizar pizarra por ID
router.put('/:id', verifyToken, verifyBoardOwnership, updateBoard);

// Eliminar pizarra por ID
router.delete('/:id', verifyToken, verifyBoardOwnership, deleteBoard);

// Marcar pizarra como favorita exclusiva
router.put('/:id/favorite', verifyToken, verifyBoardOwnership, setFavorite);

module.exports = router;
