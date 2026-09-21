const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    level: {
      type: String,
      default: "Beginner",
    },

    learningGoal: {
      type: String,
      default: "",
    },

    wordsLearned: {
      type: Number,
      default: 0,
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    speakingSessions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);