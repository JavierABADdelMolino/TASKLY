const multer = require('multer');
const path = require('path');

// Función para sanear el username (quitar espacios, acentos, símbolos)
const sanitizeUsername = (username) => {
  return username
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')      // espacios por guiones
    .replace(/[^\w-]/g, '');   // elimina cualquier carácter que no sea letra, número, _ o -
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const rawUsername = req.body.username || 'user';
    const cleanUsername = sanitizeUsername(rawUsername);
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const filename = `avatar-${cleanUsername}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png)'));
  }
};

const uploadAvatarMiddleware = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
});

module.exports = uploadAvatarMiddleware;
