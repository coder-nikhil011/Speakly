const Assignment = require('../models/Assignment');
const JoinRequest = require('../models/JoinRequest');
const { createNotification } = require('../utils/notificationHelper');
const gamificationService = require('../services/gamificationService');

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacherId: req.user.userId }).populate('studentsEnrolled', 'name email');
    res.json({ success: true, assignments });
  } catch (error) { res.status(500).json({ success: false, message: 'Error fetching assignments' }); }
};

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, message: 'Assignment title is required.' });
    const connections = await JoinRequest.find({ teacherId: req.user.userId, status: 'accepted' }).select('studentId');
    const assignment = await Assignment.create({ title: title.trim(), description: description || '', dueDate, teacherId: req.user.userId, studentsEnrolled: connections.map(c => c.studentId) });

    // Notify students
    const notifications = connections.map(c => createNotification({
      recipient: c.studentId,
      type: 'assignment',
      title: 'New assignment received',
      message: `Teacher has assigned you: ${title.trim()}`,
      relatedId: assignment._id
    }));
    await Promise.all(notifications);

    // Add bonus XP to students for the new challenge
    const xpPromises = connections.map(c => gamificationService.addXP(c.studentId, 10));
    await Promise.all(xpPromises);

    res.status(201).json({ success: true, assignment });
  } catch (error) { res.status(400).json({ success: false, message: 'Error creating assignment' }); }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, teacherId: req.user.userId }).populate('studentsEnrolled', 'name email');
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    res.json({ success: true, assignment });
  } catch (error) { res.status(500).json({ success: false, message: 'Error fetching assignment' }); }
};

exports.getStudentAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ studentsEnrolled: req.user.userId }).populate('teacherId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error) { res.status(500).json({ success: false, message: 'Error fetching your assignments' }); }
};
