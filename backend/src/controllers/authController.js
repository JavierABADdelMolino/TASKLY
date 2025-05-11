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
  const { username, email, password, birthDate } = req.body;

  try {
    // Verifica si ya existe un usuario con ese email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crea el nuevo usuario con fecha de nacimiento
    const user = new User({ username, email, password, birthDate });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, username, email },
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
    // Busca el usuario y verifica la contraseña
    const user = await User.findOne({ email });
    const isValid = user && await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: { id: user._id, username: user.username, email },
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
      birthDate: user.birthDate,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al recuperar el usuario', error: err.message });
  }
};
