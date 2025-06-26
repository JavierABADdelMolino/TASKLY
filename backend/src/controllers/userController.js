const fs = require('fs');
const path = require('path');
const cloudinaryService = require('../services/cloudinaryService');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// GET /api/users/me
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const responseData = user.toObject();
    responseData.isGoogleUser = !!user.googleId;

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil', error: err.message });
  }
};

// PUT /api/users/me
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, birthDate, gender, avatar } = req.body;
    const avatarFile = req.file;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    let updated = false;
    const previousGender = user.gender;

    // Campos simples
    if (firstName && firstName !== user.firstName) {
      user.firstName = firstName;
      updated = true;
    }
    if (lastName && lastName !== user.lastName) {
      user.lastName = lastName;
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

    // Subida de nuevo avatar
    if (avatarFile) {
      const uploadResult = await cloudinaryService.uploadAvatar(avatarFile);
      user.avatarUrl = uploadResult.secure_url;
      updated = true;
    }

    // Eliminar avatar (volver al predeterminado)
    if (!avatarFile && avatar === '') {
      const oldAvatar = user.avatarUrl;
      const newGender = gender || user.gender;
      const defaultAvatar = newGender === 'female'
        ? '/public/avatars/default-avatar-female.png'
        : '/public/avatars/default-avatar-male.png';

      // Si era local
      if (oldAvatar && oldAvatar.startsWith('/uploads/avatars/')) {
        const fullPath = path.join(__dirname, '..', '..', oldAvatar.replace(/^\/+/, ''));
        fs.unlink(fullPath, err => {
          if (err) console.warn('No se pudo eliminar el avatar anterior:', err.message);
        });
      }
      // Si era Cloudinary
      else if (oldAvatar && oldAvatar.includes('res.cloudinary.com')) {
        try {
          const parts = oldAvatar.split('/');
          const fileName = parts[parts.length - 1];
          const publicId = `avatars/${fileName.split('.')[0]}`;
          await cloudinaryService.deleteImage(publicId);
        } catch (err) {
          console.warn('No se pudo eliminar el avatar de Cloudinary:', err.message);
        }
      }

      user.avatarUrl = defaultAvatar;
      updated = true;
    }

    // Si cambia género y estaba usando avatar por defecto
    if (!avatarFile && !avatar && gender && previousGender !== gender) {
      const oldDef = `/public/avatars/default-avatar-${previousGender}.png`;
      const newDef = `/public/avatars/default-avatar-${gender}.png`;
      if (user.avatarUrl === oldDef) {
        user.avatarUrl = newDef;
        updated = true;
      }
    }

    if (updated) {
      await user.save();
    }

    const updatedUser = await User.findById(user.id).select('-password');
    const responseData = updatedUser.toObject();
    responseData.isGoogleUser = !!updatedUser.googleId;

    res.json(responseData);
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
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.googleId) {
      return res.status(403).json({
        message: 'Los usuarios que inician sesión con Google no pueden cambiar su contraseña',
        isGoogleAccount: true
      });
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
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Eliminar boards, columns y tasks asociados
    const Board = require('../models/Board');
    const Column = require('../models/Column');
    const Task = require('../models/Task');

    const boards = await Board.find({ user: userId }).select('_id');
    const boardIds = boards.map(b => b._id);
    const columns = await Column.find({ board: { $in: boardIds } }).select('_id');
    const columnIds = columns.map(c => c._id);

    await Task.deleteMany({ column: { $in: columnIds } });
    await Column.deleteMany({ board: { $in: boardIds } });
    await Board.deleteMany({ user: userId });

    // Eliminar avatar de Cloudinary o local
    if (process.env.NODE_ENV === 'production' && user.avatarUrl?.includes('res.cloudinary.com')) {
      await cloudinaryService.deleteImage(`avatars/${userId}`);
    } else if (user.avatarUrl?.startsWith('/uploads/avatars/')) {
      const fullPath = path.join(__dirname, '..', '..', user.avatarUrl.replace(/^\/+/, ''));
      fs.unlink(fullPath, err => {
        if (err) console.warn('No se pudo eliminar el avatar del usuario:', err.message);
      });
    }

    // Eliminar usuario
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Cuenta y datos relacionados eliminados correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar cuenta', error: err.message });
  }
};
