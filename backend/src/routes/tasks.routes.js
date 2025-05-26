const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require('../middlewares/authMiddleware');
const verifyColumnOwnership = require('../middlewares/columnOwnershipMiddleware');
const verifyTaskOwnership = require('../middlewares/taskOwnershipMiddleware');

// Controllers
const {
  getTasksByColumn,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// GET /api/tasks/columns/:columnId - Obtener tareas de una columna específica
router.get('/columns/:columnId', verifyToken, verifyColumnOwnership, getTasksByColumn);
// POST /api/tasks/columns/:columnId - Crear tarea en columna específica
router.post('/columns/:columnId', verifyToken, verifyColumnOwnership, createTask);

// PUT /api/tasks/:id - Actualizar tarea por ID
router.put('/:id', verifyToken, verifyTaskOwnership, updateTask);
// DELETE /api/tasks/:id - Eliminar tarea por ID
router.delete('/:id', verifyToken, verifyTaskOwnership, deleteTask);

module.exports = router;
