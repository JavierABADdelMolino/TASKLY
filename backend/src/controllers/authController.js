const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { 
  sendMail, 
  sendWelcomeEmail, 
  sendPasswordResetEmail,
  sendGoogleLinkEmail 
} = require('../services/nodemailerService');
const cloudinaryService = require('../services/cloudinaryService');

// Inicializar el cliente OAuth de Google
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Genera un token JWT con los datos del usuario
 * @param {Object} user Usuario de Mongo
 */
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * @desc    Registro de nuevo usuario
 * @route   POST /api/auth/register
 * @access  Público
 */
exports.registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    birthDate,
    gender,
    avatarUrl // opcional: por si eliges un avatar sin subir archivo
  } = req.body;

  // Ya no guardamos la contraseña original para el email - mejora de seguridad

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Obtener la URL del avatar subido, manual o por defecto
    let finalAvatarUrl = '';

    if (req.file) {
      finalAvatarUrl = `/uploads/avatars/${req.file.filename}`;
    } else if (avatarUrl) {
      finalAvatarUrl = avatarUrl; // Opción manual desde el frontend (opcional)
    } else {
      finalAvatarUrl =
        gender === 'female'
          ? '/public/avatars/default-avatar-female.png'
          : '/public/avatars/default-avatar-male.png';
    }

    // Crear y guardar el usuario
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      birthDate,
      gender,
      avatarUrl: finalAvatarUrl
    });

    await user.save();

    const token = generateToken(user);

    // Enviar email de bienvenida moderno (sin compartir la contraseña por seguridad)
    try {
      await sendWelcomeEmail(email, firstName, email);
    } catch (mailErr) {
      console.error('Error enviando email de bienvenida:', mailErr);
    }

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        gender: user.gender,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (err) {
    // Errores de validación de Mongoose
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.values(err.errors).forEach(({ path, message }) => {
        errors[path] = message;
      });
      return res.status(400).json({ errors });
    }
    // Otros errores
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

/**
 * @desc    Inicio de sesión
 * @route   POST /api/auth/login
 * @access  Público
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email no registrado' });
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        gender: user.gender,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

/**
 * @desc    Devuelve los datos del usuario autenticado
 * @route   GET /api/auth/me
 * @access  Privado
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      gender: user.gender,
      avatarUrl: user.avatarUrl,
      isGoogleUser: !!user.googleId  // Añadimos esta propiedad
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al recuperar el usuario', error: err.message });
  }
};

/**
 * @desc    Enviar email de recuperación de contraseña
 * @route   POST /api/auth/forgot-password
 * @access  Público
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email no registrado' });
    }
    
    // Verificar si es una cuenta de Google
    if (user.isGoogleUser()) {
      return res.status(400).json({ 
        message: 'Esta cuenta usa Google para iniciar sesión',
        isGoogleAccount: true 
      });
    }
    
    // Generar token y expiración 1h
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    // Construir URL base usando CLIENT_URL y opcionalmente APP_DOMAIN para reemplazar el host
    // Base URL: CLIENT_URL env o el origen de la request
    const rawUrl = process.env.CLIENT_URL || req.get('origin');
    // Elimina slash final
    let baseUrl = rawUrl.replace(/\/$/, '');
    if (process.env.APP_DOMAIN) {
      // Reemplaza el dominio original (ej. Render) por tu dominio custom
      const { protocol } = new URL(rawUrl);
      baseUrl = `${protocol}//${process.env.APP_DOMAIN}`;
    }
    const resetUrl = `${baseUrl}/reset-password/${token}`;
    // Enviar email de restablecimiento con plantilla HTML
    await sendPasswordResetEmail(email, resetUrl);
    res.json({ message: 'Email de recuperación enviado' });
  } catch (err) {
    console.error('Error en forgotPassword:', err);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

/**
 * @desc    Restablecer contraseña con token
 * @route   POST /api/auth/reset-password/:token
 * @access  Público
 */
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    // Generar nuevo token para iniciar sesión automáticamente
    const newToken = generateToken(user);
    res.json({ message: 'Contraseña restablecida correctamente', token: newToken });
  } catch (err) {
    console.error('Error en resetPassword:', err);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

/**
 * @desc    Iniciar sesión o pre-registro con Google
 * @route   POST /api/auth/google
 * @access  Público
 */
exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  
  try {
    // Verificar token con Google
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, email_verified, given_name, family_name, sub: googleId, picture } = payload;
    
    if (!email_verified) {
      return res.status(400).json({ message: 'El email de Google no está verificado' });
    }
    
    // Buscar si ya existe el usuario con este googleId
    let existingUser = await User.findOne({ googleId: googleId });
    
    // Si no encontramos por googleId, buscamos por email
    if (!existingUser) {
      existingUser = await User.findOne({ email: email });
      
      // Si existe un usuario con el mismo email pero sin googleId,
      // es un usuario registrado normalmente que intenta usar Google
      if (existingUser && !existingUser.googleId) {
        // Devolver que necesita enlazar cuentas con un código específico
        return res.json({
          needsLinking: true,
          code: 'LINK_GOOGLE',
          email: email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          googleId: googleId,
          tokenId: tokenId
        });
      }
    }
    
    if (existingUser) {
      // Usuario con Google ya registrado, iniciar sesión directamente
      const token = generateToken(existingUser);
      return res.json({
        token,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          birthDate: existingUser.birthDate,
          gender: existingUser.gender,
          avatarUrl: existingUser.avatarUrl
        }
      });
    } else {
      // Si no existe, devolver datos para preregistro
      // Se requerirá completar con datos adicionales
      return res.json({
        needsCompletion: true,
        code: 'NEEDS_COMPLETION',
        email: email,
        firstName: given_name || '',
        lastName: family_name || '',
        avatarUrl: picture || '',
        googleId: googleId
      });
    }
  } catch (err) {
    console.error('Error en googleLogin:', err);
    res.status(500).json({ message: 'Error al autenticar con Google', error: err.message });
  }
};

/**
 * @desc    Completar registro con Google (datos adicionales)
 * @route   POST /api/auth/google-register-complete
 * @access  Público
 */
exports.completeGoogleRegister = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      googleId, 
      birthDate, 
      gender, 
      avatarUrl 
    } = req.body;
    
    // Verificar que no exista el usuario mientras tanto
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    
    // Determinar la URL del avatar según las opciones disponibles
    let finalAvatarUrl;
    
    // Prioridad 1: Si hay un archivo de avatar subido
    if (req.file) {
      if (process.env.NODE_ENV === 'production') {
        // En producción, subir a Cloudinary
        try {
          const result = await cloudinaryService.uploadAvatar(req.file);
          finalAvatarUrl = result.secure_url;
        } catch (cloudinaryError) {
          console.error('Error al subir avatar a Cloudinary:', cloudinaryError);
          // Si falla, usar avatar por defecto según género
          finalAvatarUrl = gender === 'female'
            ? '/public/avatars/default-avatar-female.png'
            : '/public/avatars/default-avatar-male.png';
        }
      } else {
        // En desarrollo, usar ruta local
        finalAvatarUrl = `/uploads/avatars/${req.file.filename}`;
      }
    } 
    // Prioridad 2: Si se especificó una URL de avatar de Google
    else if (avatarUrl && avatarUrl.trim() !== '') {
      finalAvatarUrl = avatarUrl;
    }
    // Prioridad 3: Usar avatar predeterminado según género
    else {
      finalAvatarUrl = gender === 'female'
        ? '/public/avatars/default-avatar-female.png'
        : '/public/avatars/default-avatar-male.png';
    }
    
    console.log(`Avatar seleccionado para ${email}:`, finalAvatarUrl);
    
    // Crear usuario sin contraseña para cuentas de Google
    const newUser = new User({
      firstName,
      lastName,
      email,
      // No establecemos password para usuarios de Google
      birthDate,
      gender,
      googleId,
      avatarUrl: finalAvatarUrl
    });
    
    await newUser.save();
    
    // Generar token
    const token = generateToken(newUser);
    
    // Enviar email de bienvenida (opcional)
    try {
      await sendWelcomeEmail(email, firstName, email, "Has iniciado sesión con Google. Utiliza siempre ese método para acceder a tu cuenta.");
    } catch (mailErr) {
      console.error('Error enviando email de bienvenida:', mailErr);
    }

    // Devolver datos para inicio de sesión directo
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        birthDate: newUser.birthDate,
        gender: newUser.gender,
        avatarUrl: newUser.avatarUrl
      }
    });
  } catch (err) {
    console.error('Error en completeGoogleRegister:', err);
    
    // Manejar errores de validación
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.keys(err.errors).forEach(key => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ validation: errors });
    }
    
    res.status(500).json({ message: 'Error al completar el registro', error: err.message });
  }
};

/**
 * @desc    Enlaza una cuenta de Google con una cuenta existente
 * @route   POST /api/auth/link-google-account
 * @access  Público
 */
exports.linkGoogleAccount = async (req, res) => {
  const { email, googleId, tokenId } = req.body;
  
  try {
    // Verificar token con Google para asegurar la autenticidad
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    // Verificar que el email coincida con el del token
    if (payload.email !== email) {
      return res.status(400).json({ message: 'El email no coincide con la cuenta de Google' });
    }
    
    // Buscar usuario existente
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Enlazar cuenta de Google
    user.googleId = googleId;
    // Si es un usuario de Google, no tendrá contraseña
    user.password = undefined;
    
    await user.save();
    
    // Enviar notificación por email sobre la vinculación con Google
    try {
      await sendGoogleLinkEmail(user.email, user.firstName, user.email);
    } catch (mailErr) {
      console.error('Error enviando email de notificación:', mailErr);
      // No bloqueamos el flujo por error de email
    }
    
    // Generar token
    const token = generateToken(user);
    
    res.json({
      message: 'Cuenta enlazada correctamente',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        gender: user.gender,
        avatarUrl: user.avatarUrl
      }
    });
    
  } catch (err) {
    console.error('Error en linkGoogleAccount:', err);
    res.status(500).json({ message: 'Error al enlazar cuenta', error: err.message });
  }
};
