const Column = require('../models/Column');
const Board = require('../models/Board');

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
    const { boardId } = req.params;
    const { title, order } = req.body;

    if (!title || order === undefined) {
      return res.status(400).json({ message: 'Título y orden son obligatorios' });
    }

    const column = new Column({
      board: boardId,
      title,
      order
    });

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

// Eliminar columna por ID con validación de propiedad
exports.deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;

    const column = await Column.findById(id);
    if (!column) return res.status(404).json({ message: 'Columna no encontrada' });

    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta columna' });
    }

    await column.deleteOne();
    res.json({ message: 'Columna eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar columna', error: err.message });
  }
};
