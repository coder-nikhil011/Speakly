const StudentProfile = require("../models/StudentProfile");
const TeacherProfile = require("../models/TeacherProfile");
const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "student") {
      const profile = await StudentProfile.findOneAndUpdate(
        { userId },
        { ...req.body },
        { upsert: true, new: true }
      );
      return res.json({ success: true, data: profile });
    } else if (user.role === "teacher") {
      const profile = await TeacherProfile.findOneAndUpdate(
        { userId },
        { ...req.body },
        { upsert: true, new: true }
      );
      return res.json({ success: true, data: profile });
    }

    res.status(400).json({ success: false, message: "Invalid user role" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profile;
    if (user.role === "student") {
      profile = await StudentProfile.findOne({ userId });
    } else {
      profile = await TeacherProfile.findOne({ userId });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        learningLevel: user.learningLevel,
        id: user._id,
      },
      profile: profile || {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { updateProfile, getProfile };
