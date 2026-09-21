const mongoose = require('mongoose');

const learningContentProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  contentType: { type: String, enum: ['sentence', 'phrase', 'modal'], required: true },
  contentKey: { type: String, required: true },
  contentText: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  correctAttempts: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  lastPracticedAt: { type: Date, default: null },
}, { timestamps: true });

learningContentProgressSchema.index({ userId: 1, contentType: 1, contentKey: 1 }, { unique: true });
module.exports = mongoose.model('LearningContentProgress', learningContentProgressSchema);
