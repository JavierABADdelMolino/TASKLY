const Column = require('../models/Column');
const Board = require('../models/Board');

const verifyColumnOwnership = async (req, res, next) => {
  const columnId = req.params.columnId || req.params.id || req.body.column;
  if (!columnId) {
    return res.status(400).json({ message: 'ID de la columna no proporcionado' });
  }
  try {
    const column = await Column.findById(columnId);
    if (!column) {
      return res.status(404).json({ message: 'Columna no encontrada' });
    }
    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a esta columna' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error al verificar propiedad de la columna', error: err.message });
  }
};

module.exports = verifyColumnOwnership;
