const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMail } = require('../services/mailService');

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
    username,
    email,
    password,
    birthDate,
    gender,
    theme,
    avatarUrl // opcional: por si eliges un avatar sin subir archivo
  } = req.body;

  // Guardar contraseña original para el email
  const originalPassword = password;

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
      username,
      email,
      password,
      birthDate,
      gender,
      theme,
      avatarUrl: finalAvatarUrl
    });

    await user.save();

    const token = generateToken(user);

    // Enviar email de bienvenida con usuario y contraseña
    try {
      await sendMail(
        email,
        'Bienvenido a Taskly',
        `<p>Hola ${firstName},</p><p>Tu cuenta ha sido creada exitosamente.</p><p><strong>Email:</strong> ${email}</p><p><strong>Contraseña:</strong> ${originalPassword}</p>`
      );
    } catch (mailErr) {
      console.error('Error enviando email de bienvenida:', mailErr);
    }

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        gender: user.gender,
        theme: user.theme,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (err) {
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
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        gender: user.gender,
        theme: user.theme,
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
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      gender: user.gender,
      theme: user.theme,
      avatarUrl: user.avatarUrl
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
    // Generar token y expiración 1h
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    // Construir URL de frontend: PRIORIDAD FRONTEND_URL > CLIENT_URL
    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL;
    const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password/${token}`;
    await sendMail(
      email,
      'Recuperación de contraseña Taskly',
      `<p>Para restablecer tu contraseña, haz click <a href="${resetUrl}">aquí</a>. Este enlace expirará en 1 hora.</p>`
    );
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
