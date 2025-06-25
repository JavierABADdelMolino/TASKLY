const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Debe ser un correo válido']
  },
  password: {
    type: String,
    required: function() {
      // La contraseña solo es requerida si no es una cuenta de Google
      return !this.googleId;
    },
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  birthDate: {
    type: Date,
    required: [true, 'La fecha de nacimiento es obligatoria']
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message: 'El género debe ser "male" o "female"'
    },
    required: [true, 'El género es obligatorio']
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  // --- Campo para autenticación con Google ---
  googleId: {
    type: String,
    sparse: true  // Índice disperso para permitir valores null
  },
  // --- Campos para recuperación de contraseña ---
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  // No hashear si no hay modificación de password o si el usuario es de Google y no tiene password
  if (!this.isModified('password') || (this.googleId && !this.password)) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método para verificar si es un usuario de Google
userSchema.methods.isGoogleUser = function() {
  return !!this.googleId;
};

module.exports = mongoose.model('User', userSchema);
