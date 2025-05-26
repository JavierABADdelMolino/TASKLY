const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  importance: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  column: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
