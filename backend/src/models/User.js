const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Esquema del modelo de usuario
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Debe ser un correo válido']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  birthDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

// Middleware que encripta la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Solo si ha cambiado
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método de instancia para verificar contraseñas
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
