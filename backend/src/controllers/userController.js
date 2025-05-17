const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// GET /api/users/me
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil', error: err.message });
  }
};

// PUT /api/users/me
exports.updateUserProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      birthDate,
      gender,
      theme,
      avatar // puede venir vacío ("") si quiere eliminar el avatar actual
    } = req.body;

    const avatarFile = req.file;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    let updated = false;

    if (firstName && firstName !== user.firstName) {
      user.firstName = firstName;
      updated = true;
    }

    if (lastName && lastName !== user.lastName) {
      user.lastName = lastName;
      updated = true;
    }

    if (username && username !== user.username) {
      user.username = username;
      updated = true;
    }

    if (email && email !== user.email) {
      user.email = email;
      updated = true;
    }

    if (birthDate && new Date(birthDate).toISOString() !== user.birthDate.toISOString()) {
      user.birthDate = new Date(birthDate);
      updated = true;
    }

    if (gender && gender !== user.gender) {
      user.gender = gender;
      updated = true;
    }

    if (theme && theme !== user.theme) {
      user.theme = theme;
      updated = true;
    }

    // Subida de nuevo avatar
    if (avatarFile) {
      const oldAvatarPath = user.avatarUrl;
      user.avatarUrl = `/uploads/avatars/${avatarFile.filename}`;
      updated = true;

      if (oldAvatarPath && !oldAvatarPath.includes('/uploads/images/')) {
        const fullPath = path.join(__dirname, '..', oldAvatarPath);
        fs.unlink(fullPath, err => {
          if (err) console.warn('No se pudo eliminar el avatar anterior:', err.message);
        });
      }
    }

    // Eliminación del avatar actual y asignación del predeterminado
    if (!avatarFile && typeof avatar !== 'undefined' && avatar === '') {
      const oldAvatarPath = user.avatarUrl;
      const defaultAvatar = user.gender === 'female'
        ? '/uploads/images/default-female.png'
        : '/uploads/images/default-male.png';

      if (oldAvatarPath && !oldAvatarPath.includes('/uploads/images/')) {
        const fullPath = path.join(__dirname, '..', oldAvatarPath);
        fs.unlink(fullPath, err => {
          if (err) console.warn('No se pudo eliminar el avatar anterior:', err.message);
        });
      }

      user.avatarUrl = defaultAvatar;
      updated = true;
    }

    if (updated) await user.save();

    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: err.message });
  }
};

// PUT /api/users/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: 'Las nuevas contraseñas no coinciden' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'La contraseña actual no es correcta' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al cambiar contraseña', error: err.message });
  }
};

// DELETE /api/users/me
exports.deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.avatarUrl && !user.avatarUrl.includes('/uploads/images/')) {
      const avatarPath = path.join(__dirname, '..', user.avatarUrl);
      fs.unlink(avatarPath, err => {
        if (err) console.warn('No se pudo eliminar el avatar del usuario:', err.message);
      });
    }

    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar cuenta', error: err.message });
  }
};
