const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT con los datos del usuario
 */
const generateToken = (user) => {
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
    const isValid = user && await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
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
