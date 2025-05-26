const Task = require('../models/Task');
const Column = require('../models/Column');
const Board = require('../models/Board');

const verifyTaskOwnership = async (req, res, next) => {
  const taskId = req.params.id;
  if (!taskId) return res.status(400).json({ message: 'ID de la tarea no proporcionado' });
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    const column = await Column.findById(task.column);
    if (!column) return res.status(404).json({ message: 'Columna asociada no encontrada' });
    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta tarea' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error al verificar propiedad de la tarea', error: err.message });
  }
};

module.exports = verifyTaskOwnership;
