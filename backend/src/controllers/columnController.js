const Column = require('../models/Column');
const Board = require('../models/Board');
const Task = require('../models/Task'); // Asegúrate de que la ruta sea correcta

// Obtener columnas de una pizarra
exports.getColumnsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const columns = await Column.find({ board: boardId }).sort({ order: 1 });
    res.json(columns);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener columnas', error: err.message });
  }
};

// Obtener una columna por ID (con validación de propiedad)
exports.getColumnById = async (req, res) => {
  try {
    const { id } = req.params;

    const column = await Column.findById(id);
    if (!column) return res.status(404).json({ message: 'Columna no encontrada' });

    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a esta columna' });
    }

    res.json(column);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener columna', error: err.message });
  }
};

// Crear columna en una pizarra
exports.createColumn = async (req, res) => {
  try {
    const { title } = req.body;
    const boardId = req.params.boardId;
    if (!title) {
      return res.status(400).json({ message: 'El título es obligatorio' });
    }
    // contar las columnas actuales y asignar el siguiente índice
    const count = await Column.countDocuments({ board: boardId });
    const column = new Column({ title, board: boardId, order: count });
    await column.save();
    res.status(201).json(column);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear columna', error: err.message });
  }
};

// Actualizar columna por ID con validación de propiedad
exports.updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, order } = req.body;

    const column = await Column.findById(id);
    if (!column) return res.status(404).json({ message: 'Columna no encontrada' });

    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta columna' });
    }

    if (title) column.title = title;
    if (order !== undefined) column.order = order;

    await column.save();
    res.json(column);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar columna', error: err.message });
  }
};

// Eliminar columna por ID con validación de propiedad y cascada de tareas
exports.deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const column = await Column.findById(id);
    if (!column) return res.status(404).json({ message: 'Columna no encontrada' });
    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta columna' });
    }
    // borrar tareas asociadas a esta columna
    await Task.deleteMany({ column: id });
    // borrar la columna
    await column.deleteOne();
    res.json({ message: 'Columna y tareas asociadas eliminadas correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar columna', error: err.message });
  }
};
