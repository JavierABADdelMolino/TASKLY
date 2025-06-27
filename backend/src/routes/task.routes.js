const express = require('express');
const router = express.Router();

// Middlewares
const verifyToken = require('../middlewares/authMiddleware');
const verifyColumnOwnership = require('../middlewares/columnOwnershipMiddleware');
const verifyTaskOwnership = require('../middlewares/taskOwnershipMiddleware');

// Controllers
const {
  getTasksByColumn,
  getFilteredTasksByColumn,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  suggestImportance,  // IA stub/real for existing tasks
  suggestImportanceByData  // nueva sugerencia IA antes de creación
} = require('../controllers/taskController');

// GET /api/tasks/columns/:columnId - Obtener tareas de una columna específica
router.get('/columns/:columnId', verifyToken, verifyColumnOwnership, getTasksByColumn);
// GET /api/tasks/columns/:columnId/filtered - Obtener tareas filtradas de una columna
router.get('/columns/:columnId/filtered', verifyToken, verifyColumnOwnership, getFilteredTasksByColumn);
// POST /api/tasks/columns/:columnId - Crear tarea en columna específica
router.post('/columns/:columnId', verifyToken, verifyColumnOwnership, createTask);

// PUT /api/tasks/:id - Actualizar tarea por ID
router.put('/:id', verifyToken, verifyTaskOwnership, updateTask);
// PATCH /api/tasks/:id/completion - Actualizar estado de completado de tarea
router.patch('/:id/completion', verifyToken, verifyTaskOwnership, toggleTaskCompletion);
// DELETE /api/tasks/:id - Eliminar tarea por ID
router.delete('/:id', verifyToken, verifyTaskOwnership, deleteTask);

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
