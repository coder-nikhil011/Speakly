const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// Get user's own gamification stats
router.get('/stats', protect, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.userId });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    
    res.json({
      success: true,
      xp: profile.xp,
      streak: profile.streak,
      lastActivity: profile.lastActivityDate
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get Top 10 Leaderboard
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const topStudents = await StudentProfile.find()
      .sort({ xp: -1 })
      .limit(10)
      .populate('userId', 'name email profilePhoto');

    const leaderboard = topStudents.map(s => ({
      userId: s.userId._id,
      name: s.userId.name,
      profilePhoto: s.userId.profilePhoto,
      xp: s.xp,
      streak: s.streak
    }));

    res.json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
