const mongoose = require('mongoose');

const ColumnSchema = new mongoose.Schema({
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // createdAt, updatedAt
});

module.exports = mongoose.model('Column', ColumnSchema);
