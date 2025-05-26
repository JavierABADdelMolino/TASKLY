const Task = require('../models/Task');
const Column = require('../models/Column');
const Board = require('../models/Board');

// Obtener tareas de una columna
exports.getTasksByColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const column = await Column.findById(columnId);
    if (!column) return res.status(404).json({ message: 'Columna no encontrada' });
    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a estas tareas' });
    }
    const tasks = await Task.find({ column: columnId }).sort({ order: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tareas', error: err.message });
  }
};

// Crear tarea en columna
exports.createTask = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title, description, importance, order } = req.body;
    if (!title) return res.status(400).json({ message: 'Título es obligatorio' });
    const column = await Column.findById(columnId);
    if (!column) return res.status(404).json({ message: 'Columna no encontrada' });
    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para crear tareas' });
    }
    const count = await Task.countDocuments({ column: columnId });
    const task = new Task({
      title,
      description: description || '',
      importance: importance || 'medium',
      column: columnId,
      order: order !== undefined ? order : count
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear tarea', error: err.message });
  }
};

// Actualizar tarea
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, importance, column: newColumnId, order } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    const column = await Column.findById(task.column);
    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta tarea' });
    }
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (importance) task.importance = importance;
    if (newColumnId) task.column = newColumnId;
    if (order !== undefined) task.order = order;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar tarea', error: err.message });
  }
};

// Eliminar tarea
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    const column = await Column.findById(task.column);
    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta tarea' });
    }
    await task.deleteOne();
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar tarea', error: err.message });
  }
};
