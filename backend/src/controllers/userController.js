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
      birthDate,
      gender,
      theme,
      avatar // string vacío si se quiere eliminar
    } = req.body;

    const avatarFile = req.file;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    let updated = false;

    // Actualización de campos simples
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

    // Subida de un nuevo avatar
    if (avatarFile) {
      const oldAvatarPath = user.avatarUrl;
      user.avatarUrl = `/uploads/avatars/${avatarFile.filename}`;
      updated = true;

      // Eliminar avatar anterior si era personalizado
      if (oldAvatarPath && oldAvatarPath.startsWith('/uploads/avatars/')) {
        const fullPath = path.join(__dirname, '..', '..', oldAvatarPath.replace(/^\/+/, ''));
        fs.unlink(fullPath, err => {
          if (err) console.warn('No se pudo eliminar el avatar anterior:', err.message);
        });
      }
    }

    // Eliminar avatar actual (volver al predeterminado)
    if (!avatarFile && avatar === '') {
      const oldAvatarPath = user.avatarUrl;

      // Establecer avatar por defecto según el género actual o actualizado
      const newGender = gender || user.gender;
      const defaultAvatar = newGender === 'female'
        ? '/public/avatars/default-avatar-female.png'
        : '/public/avatars/default-avatar-male.png';

      // Eliminar avatar anterior si era personalizado
      if (oldAvatarPath && oldAvatarPath.startsWith('/uploads/avatars/')) {
        const fullPath = path.join(__dirname, '..', '..', oldAvatarPath.replace(/^\/+/, ''));
        fs.unlink(fullPath, err => {
          if (err) console.warn('No se pudo eliminar el avatar anterior:', err.message);
        });
      }

      user.avatarUrl = defaultAvatar;
      updated = true;
    }

    if (updated) await user.save();

    const updatedUser = await User.findById(user.id).select('-password');
    res.json(updatedUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar perfil', error: err.message });
  }
};

// PUT /api/users/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Los campos son obligatorios' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'La contraseña actual no es correcta' });
    }

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
      const fullPath = path.join(__dirname, '..', '..', user.avatarUrl.replace(/^\/+/, ''));
      fs.unlink(fullPath, err => {
        if (err) console.warn('No se pudo eliminar el avatar del usuario:', err.message);
      });
    }

    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar cuenta', error: err.message });
  }
};
