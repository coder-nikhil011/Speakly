const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['daily', 'weekly', 'contest'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['available', 'registered', 'completed'], default: 'available' },
  startsAt: { type: Date, default: Date.now },
  dueAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
