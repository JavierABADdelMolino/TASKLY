const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Ruta para registro de usuario
router.post('/register', registerUser);

// Ruta para login
router.post('/login', loginUser);

module.exports = router;
