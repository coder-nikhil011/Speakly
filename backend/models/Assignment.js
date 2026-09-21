const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
