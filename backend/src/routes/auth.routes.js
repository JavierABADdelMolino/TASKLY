const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
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

module.exports = router;
