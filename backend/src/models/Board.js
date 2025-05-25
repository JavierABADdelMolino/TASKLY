const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  favorite: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true // crea createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Board', BoardSchema);
