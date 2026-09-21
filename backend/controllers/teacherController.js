const User = require("../models/User");
const TeacherProfile = require("../models/TeacherProfile");


// GET TEACHER PROFILE
const getTeacherProfile = async (req, res) => {
  try {

    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Teacher access only",
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


    const profile = await TeacherProfile.findOne({
      userId: req.user.userId,
    });


    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found",
      });
    }


    res.json({
      success: true,
      user,
      profile,
    });

  } catch (error) {

    console.error("Get teacher profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE TEACHER PROFILE
const updateTeacherProfile = async (req, res) => {
  try {

    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Teacher access only",
      });
    }


    const {
      name,
      profilePhoto,
      subject,
      institution,
      experience,
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


    // Update Teacher Profile
    const profile =
      await TeacherProfile.findOneAndUpdate(
        {
          userId: req.user.userId,
        },
        {
          ...(subject !== undefined && {
            subject,
          }),

          ...(institution !== undefined && {
            institution,
          }),

          ...(experience !== undefined && {
            experience,
          }),
        },
        {
          new: true,
          runValidators: true,
        }
      );


    res.json({
      success: true,
      message: "Teacher profile updated successfully",
      user,
      profile,
    });

  } catch (error) {

    console.error("Update teacher profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  getTeacherProfile,
  updateTeacherProfile,
};