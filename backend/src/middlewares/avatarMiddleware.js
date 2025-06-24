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

// Determinar carpeta raíz de uploads según entorno
const UPLOADS_ROOT = process.env.NODE_ENV === 'production'
  ? process.env.UPLOADS_PATH
  : path.join(__dirname, '..', '..', 'uploads');
const AVATARS_PATH = path.join(UPLOADS_ROOT, 'avatars');
// Crear carpeta avatars solo en desarrollo
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(AVATARS_PATH)) {
  fs.mkdirSync(AVATARS_PATH, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATARS_PATH),
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
