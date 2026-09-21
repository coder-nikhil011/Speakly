const mongoose = require("mongoose");

const teacherProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    subject: {
      type: String,
      default: "English",
    },

    institution: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    totalStudents: {
      type: Number,
      default: 0,
    },

    activeClasses: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TeacherProfile",
  teacherProfileSchema
);