const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// Configurar almacenamiento: en producción memoria para Cloudinary, en desarrollo disco
const isProduction = process.env.NODE_ENV === 'production';
let storage;
if (isProduction) {
  storage = multer.memoryStorage();
} else {
  const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'uploads');
  const AVATARS_PATH = path.join(UPLOADS_ROOT, 'avatars');
  if (!fs.existsSync(AVATARS_PATH)) {
    fs.mkdirSync(AVATARS_PATH, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, AVATARS_PATH),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const email = req.user?.email || req.body.email || 'unknown';
      const safeEmail = sanitizeEmail(email);
      const timestamp = getFormattedTimestamp();
      cb(null, `avatar_${safeEmail}_${timestamp}${ext}`);
    }
  });
}

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
