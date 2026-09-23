const User = require("../models/User");
const JoinRequest = require("../models/JoinRequest");
const { createNotification } = require('../utils/notificationHelper');

/**
 * Student: Request to join a teacher's class.
 */
const requestJoin = async (req, res) => {
  try {
    const { teacherEmail } = req.body;
    const studentId = req.user.userId;

    // 1. Find teacher by email
    const teacher = await User.findOne({ email: teacherEmail, role: "teacher" });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found with this email." });
    }

    // 2. Check if request already exists
    const existingRequest = await JoinRequest.findOne({ studentId, teacherId: teacher._id });
    if (existingRequest?.status === "accepted") return res.status(400).json({ success: false, message: "You are already connected to this teacher." });
    if (existingRequest?.status === "pending") return res.status(400).json({ success: false, message: "A request is already pending." });
    if (existingRequest?.status === "rejected") {
      existingRequest.status = "pending";
      existingRequest.requestedAt = new Date();
      await existingRequest.save();
      
      await createNotification({
        recipient: existingRequest.teacherId,
        type: 'connection',
        title: 'Student accepted your request',
        message: `A student has requested to join your class.`,
        relatedId: studentId
      });
    } else {
      await JoinRequest.create({ studentId, teacherId: teacher._id });
    }

    res.json({ success: true, message: "Join request sent successfully!" });
  } catch (error) {
    console.error("Request join error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Teacher: Get all pending requests.
 */
const getPendingRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find({ teacherId: req.user.userId, status: "pending" })
      .populate("studentId", "name email");

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Teacher: Accept or Reject a request.
 */
const handleRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body; // action: 'accepted' | 'rejected'
    
    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const request = await JoinRequest.findById(requestId);
    if (!request || request.teacherId.toString() !== req.user.userId) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = action;
    await request.save();

    if (action === 'accepted') {
      await createNotification({
        recipient: request.studentId,
        type: 'connection',
        title: 'Teacher connection accepted',
        message: 'Your teacher has accepted your connection request!',
        relatedId: request.teacherId
      });
    }

    res.json({ success: true, message: `Request ${action} successfully!` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getMyTeachers = async (req, res) => {
  try {
    const requests = await JoinRequest.find({ studentId: req.user.userId, status: { $in: ["accepted", "pending"] } })
      .populate("teacherId", "name email profilePhoto")
      .sort({ updatedAt: -1 });
    const teachers = requests.filter(r => r.teacherId).map(r => ({ ...r.teacherId.toObject(), connectionStatus: r.status }));
    res.json({ success: true, teachers, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load teachers" });
  }
};

module.exports = {
  requestJoin,
  getPendingRequests,
  handleRequest,
  getMyTeachers,
};
