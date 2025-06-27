const Task = require('../models/Task');
const Column = require('../models/Column');
const Board = require('../models/Board');

// Integración OpenAI
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    
    // Para ordenar: primero las no completadas por orden y luego las completadas por fecha de completado
    const tasks = await Task.find({ column: columnId }).sort({ 
      completed: 1, // false antes que true
      order: 1, 
      completedAt: -1 // Las completadas más recientes primero
    });
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tareas', error: err.message });
  }
};

// Crear tarea en columna
exports.createTask = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title, description, importance, dueDateTime } = req.body;
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
      order: count,
      dueDateTime: dueDateTime ? new Date(dueDateTime) : null
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
    const { title, description, importance, column: newColumnId, order, dueDateTime } = req.body;
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
    // Actualizar fecha y hora de vencimiento
    if (dueDateTime !== undefined) {
      task.dueDateTime = dueDateTime ? new Date(dueDateTime) : null;
    }
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

// Sugerencia de importancia antes de crear una tarea (usa title, description y dueDateTime del body)
exports.suggestImportanceByData = async (req, res) => {
  const { title = '', description = '', dueDateTime = '' } = req.body;
  try {
    const prompt = `Eres un asistente amigable y empático que asigna la importancia adecuada a una tarea (alta, media o baja) basándose en su título, descripción y fecha/hora de entrega. Título: "${title}". Descripción: "${description}". Fecha y hora de entrega: "${dueDateTime || 'No especificada'}". Responde únicamente con "high", "medium" o "low".`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 1
    });
    const result = response.choices?.[0]?.message?.content?.trim().toLowerCase();
    if (!['high','medium','low'].includes(result)) {
      return res.status(500).json({ message: 'Respuesta IA inesperada', suggestion: result });
    }
    return res.json({ suggestedImportance: result });
  } catch (err) {
    return res.status(500).json({ message: 'Error al sugerir importancia', error: err.message });
  }
};
// POST /api/tasks/:id/suggest-importance - Sugerencia de importancia sobre tarea existente
exports.suggestImportance = async (req, res) => {
  try {
    const { id } = req.params;
    const { title: newTitle, description: newDesc, dueDateTime } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    const column = await Column.findById(task.column);
    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta tarea' });
    }
    // Preferir datos enviados por cliente para recalcular sugerencia
    const title = newTitle !== undefined ? newTitle : task.title;
    const description = newDesc !== undefined ? newDesc : task.description;
    const dueInfo = dueDateTime !== undefined ? dueDateTime : (task.dueDateTime ? task.dueDateTime.toISOString() : 'No especificada');
    const prompt = `Eres un asistente amigable y empático que asigna la importancia adecuada a una tarea (alta, media o baja) basándose en su título, descripción y fecha/hora de entrega. Título: "${title}". Descripción: "${description}". Fecha y hora de entrega: "${dueInfo}". Responde únicamente con "high", "medium" o "low".`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 1
    });
    const result = response.choices?.[0]?.message?.content?.trim().toLowerCase();
    if (!['high','medium','low'].includes(result)) {
      return res.status(500).json({ message: 'Respuesta IA inesperada', suggestion: result });
    }
    return res.json({ suggestedImportance: result });
  } catch (err) {
    return res.status(500).json({ message: 'Error al sugerir importancia', error: err.message });
  }
};

// Marcar tarea como completada o no completada
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    // Validar que el campo completed esté presente y sea booleano
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ 
        message: 'El campo completed es requerido en el body y debe ser un booleano',
        receivedBody: req.body 
      });
    }
    
    // Buscar la tarea por ID
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    const column = await Column.findById(task.column);
    if (!column) {
      return res.status(404).json({ message: 'Columna no encontrada' });
    }
    
    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta tarea' });
    }
    
    // Actualizar estado de completado
    task.completed = completed;
    task.completedAt = completed ? new Date() : null;
    
    const updatedTask = await task.save();
    
    return res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar estado de tarea', error: err.message });
  }
};

// Obtener tareas filtradas por estado de completado
exports.getFilteredTasksByColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { filter = 'all' } = req.query; // 'all', 'completed', 'pending'
    
    const column = await Column.findById(columnId);
    if (!column) return res.status(404).json({ message: 'Columna no encontrada' });
    
    const board = await Board.findById(column.board);
    if (!board || board.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a estas tareas' });
    }
    
    let query = { column: columnId };
    
    if (filter === 'completed') {
      query.completed = true;
    } else if (filter === 'pending') {
      query.completed = false;
    }
    
    // Para ordenar: primero las no completadas por orden, luego las completadas por fecha de completado
    const tasks = await Task.find(query).sort({ 
      completed: 1, // false antes que true
      order: 1, 
      completedAt: -1 // Las completadas más recientes primero
    });
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tareas', error: err.message });
  }
};
