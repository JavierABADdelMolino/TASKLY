const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const avatarMiddleware = require('../middlewares/avatarMiddleware');
const { getUserProfile, updateUserProfile, changePassword, deleteUserAccount } = require('../controllers/userController');

// Obtener datos del perfil autenticado
router.get('/me', verifyToken, getUserProfile);

// Editar datos del perfil (nombre, email, avatar, etc.)
router.put('/me', verifyToken, avatarMiddleware.single('avatar'), updateUserProfile);

// Cambiar contraseña del usuario autenticado
router.put('/change-password', verifyToken, changePassword);

// Eliminar cuenta del usuario autenticado
router.delete('/me', verifyToken, deleteUserAccount);

module.exports = router;
