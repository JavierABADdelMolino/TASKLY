const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

router.get('/private', verifyToken, (req, res) => {
  res.json({ message: `Hola ${req.user.email}, accediste a una ruta protegida ✅` });
});

module.exports = router;
