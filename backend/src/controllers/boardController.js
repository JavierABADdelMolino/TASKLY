const Board = require('../models/Board');

// GET /api/boards - Obtener todas las pizarras del usuario autenticado
exports.getBoards = async (req, res) => {
  try {
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

// DELETE /api/boards/:id - Eliminar pizarra por ID
exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findOneAndDelete({ _id: id, user: req.user.id });
    if (!board) {
      return res.status(404).json({ message: 'Pizarra no encontrada' });
    }

    res.json({ message: 'Pizarra eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la pizarra', error: err.message });
  }
};
