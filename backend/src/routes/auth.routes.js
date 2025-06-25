const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe, 
  forgotPassword, 
  resetPassword,
  googleLogin,
  completeGoogleRegister,
  linkGoogleAccount
} = require('../controllers/authController');
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

// @route   POST /api/auth/google
// @desc    Iniciar sesión o iniciar registro con Google
router.post('/google', googleLogin);

// @route   POST /api/auth/google-register-complete
// @desc    Completar registro con Google (datos adicionales)
router.post('/google-register-complete', avatarMiddleware.single('avatar'), completeGoogleRegister);

// @route   POST /api/auth/link-google-account
// @desc    Enlazar cuenta de Google con una cuenta existente
router.post('/link-google-account', linkGoogleAccount);

module.exports = router;
