const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  importance: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  column: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
  order: { type: Number, default: 0 },
  suggestedImportance: { type: String, enum: ['high', 'medium', 'low'], default: null }, // campo para sugerencia de importancia vía IA (stub)
  dueDateTime: { type: Date, default: null }, // fecha y hora de vencimiento de la tarea
  completed: { type: Boolean, default: false }, // indica si la tarea está completada
  completedAt: { type: Date, default: null } // fecha y hora en que se completó la tarea
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
