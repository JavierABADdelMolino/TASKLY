const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// @route   POST /api/contact
// @desc    Enviar mensaje de contacto
router.post('/', contactController.sendContactEmail);

module.exports = router;
