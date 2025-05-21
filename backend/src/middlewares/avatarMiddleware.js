const multer = require('multer');
const path = require('path');

// Sanea el email para que sea un nombre de archivo seguro
const sanitizeEmail = (email) => {
  return email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
};

// Devuelve una fecha legible como parte del nombre
const getFormattedTimestamp = () => {
  const now = new Date();
  return now.toISOString()
    .replace(/T/, '_')         // separa fecha y hora
    .replace(/:/g, '-')        // evita caracteres inválidos
    .replace(/\..+/, '');      // quita milisegundos
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const email = req.user?.email || req.body.email || 'unknown';
    const safeEmail = sanitizeEmail(email);
    const timestamp = getFormattedTimestamp();
    const filename = `avatar_${safeEmail}_${timestamp}${ext}`;
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

const avatarMiddleware = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter
});

module.exports = avatarMiddleware;
