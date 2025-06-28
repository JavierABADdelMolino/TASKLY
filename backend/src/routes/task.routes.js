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
  deleteTask,
  suggestImportance,  // IA stub/real for existing tasks
  suggestImportanceByData,  // nueva sugerencia IA antes de creación
  markTaskAsCompleted,
  markTaskAsIncomplete
} = require('../controllers/taskController');

// GET /api/tasks/columns/:columnId - Obtener tareas de una columna específica
router.get('/columns/:columnId', verifyToken, verifyColumnOwnership, getTasksByColumn);
// POST /api/tasks/columns/:columnId - Crear tarea en columna específica
router.post('/columns/:columnId', verifyToken, verifyColumnOwnership, createTask);

// PUT /api/tasks/:id - Actualizar tarea por ID
router.put('/:id', verifyToken, verifyTaskOwnership, updateTask);
// DELETE /api/tasks/:id - Eliminar tarea por ID
router.delete('/:id', verifyToken, verifyTaskOwnership, deleteTask);

// POST /api/tasks/:id/complete - Marcar tarea como completada
router.post('/:id/complete', verifyToken, verifyTaskOwnership, markTaskAsCompleted);
// POST /api/tasks/:id/incomplete - Marcar tarea como incompleta
router.post('/:id/incomplete', verifyToken, verifyTaskOwnership, markTaskAsIncomplete);

// POST /api/tasks/columns/:columnId/suggest-importance - Sugerir importancia antes de crear tarea en columna específica
router.post(
  '/columns/:columnId/suggest-importance',
  verifyToken,
  verifyColumnOwnership,
  suggestImportanceByData
);

// POST /api/tasks/:id/suggest-importance - Sugerir importancia vía IA (stub o real)
router.post('/:id/suggest-importance', verifyToken, verifyTaskOwnership, suggestImportance);

module.exports = router;
