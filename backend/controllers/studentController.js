const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");


// GET STUDENT PROFILE
const getStudentProfile = async (req, res) => {
  try {

    // Role protection
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }

    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await StudentProfile.findOne({
      userId: req.user.userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.json({
      success: true,
      user,
      profile,
    });

  } catch (error) {

    console.error("Get student profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE STUDENT PROFILE
const updateStudentProfile = async (req, res) => {
  try {

    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }

    const {
      name,
      level,
      learningGoal,
      profilePhoto,
    } = req.body;


    // Update User
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        ...(name !== undefined && { name }),
        ...(profilePhoto !== undefined && {
          profilePhoto,
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");


    // Update Student Profile
    const profile = await StudentProfile.findOneAndUpdate(
      {
        userId: req.user.userId,
      },
      {
        ...(level !== undefined && { level }),
        ...(learningGoal !== undefined && {
          learningGoal,
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    );


    res.json({
      success: true,
      message: "Student profile updated successfully",
      user,
      profile,
    });

  } catch (error) {

    console.error("Update student profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  getStudentProfile,
  updateStudentProfile,
};