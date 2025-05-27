const Board = require('../models/Board');

// GET /api/boards - Obtener todas las pizarras del usuario autenticado
exports.getBoards = async (req, res) => {
  try {
    // ordenar por fecha de creación (más recientes primero)
    const boards = await Board.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pizarras', error: err.message });
  }
};

// GET /api/boards/:id - Obtener una pizarra por ID si pertenece al usuario
exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, user: req.user.id });
    if (!board) {
      return res.status(403).json({ message: 'No tienes acceso a esta pizarra' });
    }
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la pizarra', error: err.message });
  }
};

// POST /api/boards - Crear una nueva pizarra
exports.createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es obligatorio' });
    }

    const board = new Board({
      user: req.user.id,
      title,
      description
    });

    await board.save();
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear la pizarra', error: err.message });
  }
};

// PUT /api/boards/:id - Actualizar pizarra por ID
exports.updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const board = await Board.findOne({ _id: id, user: req.user.id });
    if (!board) {
      return res.status(404).json({ message: 'Pizarra no encontrada' });
    }

    if (title) board.title = title;
    if (description) board.description = description;

    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la pizarra', error: err.message });
  }
};

// DELETE /api/boards/:id - Eliminar pizarra por ID y cascada de columnas y tareas
exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    // borrar la pizarra
    const board = await Board.findOneAndDelete({ _id: id, user: req.user.id });
    if (!board) {
      return res.status(404).json({ message: 'Pizarra no encontrada' });
    }
    // eliminar columnas y tareas asociadas
    const columns = require('../models/Column');
    const Task = require('../models/Task');
    const cols = await columns.find({ board: id }).select('_id');
    const colIds = cols.map(c => c._id);
    // eliminar tareas de esas columnas
    await Task.deleteMany({ column: { $in: colIds } });
    // eliminar columnas
    await columns.deleteMany({ board: id });
    res.json({ message: 'Pizarra y datos relacionados eliminados correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la pizarra', error: err.message });
  }
};

// PUT /api/boards/:id/favorite - Marcar una pizarra como favorita exclusiva
exports.setFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    // find the board
    const board = await Board.findOne({ _id: id, user: req.user.id });
    if (!board) {
      return res.status(404).json({ message: 'Pizarra no encontrada' });
    }
    if (board.favorite) {
      // quitar favorito si ya lo era
      board.favorite = false;
      await board.save();
      return res.json(board);
    }
    // desmarcar otros favoritos y marcar éste
    await Board.updateMany({ user: req.user.id, favorite: true }, { favorite: false });
    board.favorite = true;
    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: 'Error al marcar favorito', error: err.message });
  }
};
