// middlewares/boardOwnershipMiddleware.js

const Board = require('../models/Board');

const verifyBoardOwnership = async (req, res, next) => {
  const boardId = req.params.boardId || req.body.boardId;

  if (!boardId) {
    return res.status(400).json({ message: 'ID de la pizarra no proporcionado' });
  }

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Pizarra no encontrada' });
    }

    if (board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a esta pizarra' });
    }

    req.board = board;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error al verificar acceso a la pizarra', error: err.message });
  }
};

module.exports = verifyBoardOwnership;
