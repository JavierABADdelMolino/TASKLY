const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');


// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Iniciar sesión
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Obtener usuario autenticado (requiere token)
router.get('/me', verifyToken, getMe);

module.exports = router;
