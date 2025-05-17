const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const uploadAvatarMiddleware = require('../middlewares/uploadAvatarMiddleware');
const { getUserProfile, updateUserProfile, changePassword, deleteUserAccount } = require('../controllers/userController');

// Obtener datos del perfil autenticado
router.get('/me', verifyToken, getUserProfile);

// Editar datos del perfil (nombre, email, avatar, etc.)
router.put('/me', verifyToken, uploadAvatarMiddleware.single('avatar'), updateUserProfile);

// Cambiar contraseña del usuario autenticado
router.put('/change-password', verifyToken, changePassword);

// Eliminar cuenta del usuario autenticado
router.delete('/me', verifyToken, deleteUserAccount);

module.exports = router;
