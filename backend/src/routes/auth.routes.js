const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');
const avatarMiddleware = require('../middlewares/avatarMiddleware');

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario con posible avatar
router.post('/register', avatarMiddleware.single('avatar'), registerUser);

// @route   POST /api/auth/login
// @desc    Iniciar sesión
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Obtener usuario autenticado (requiere token)
router.get('/me', verifyToken, getMe);

// @route   POST /api/auth/forgot-password
// @desc    Enviar email para recuperación de contraseña
router.post('/forgot-password', forgotPassword);
// @route   POST /api/auth/reset-password/:token
// @desc    Restablecer contraseña con token
router.post('/reset-password/:token', resetPassword);

module.exports = router;
