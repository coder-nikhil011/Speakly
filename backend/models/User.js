const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    plan: {
      type: String,
      enum: ["Basic", "Premium", "Advance"],
      default: "Basic",
    },

    learningLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    difficultWords: [
      {
        word: String,
        addedAt: { type: Date, default: Date.now },
        mastered: { type: Boolean, default: false },
      },
    ],

    learningProgress: {
      wordsLearned: { type: Number, default: 0 },
      lastSessionDate: Date,
      streak: { type: Number, default: 0 },
      lastDailyCompletionDate: { type: String, default: "" },
      totalXP: { type: Number, default: 0 },
      currentLevel: { type: Number, default: 1 },
    },

    warnings: {
      count: { type: Number, default: 0 },
      lastWarningDate: Date,
      isRestricted: { type: Boolean, default: false },
    },

    aiUsage: {
      date: { type: String, default: "" },
      // secondsUsed is the actual active AI time consumed today.
      secondsUsed: { type: Number, default: 0, min: 0 },
      // Legacy field kept for compatibility with older records/UI.
      minutesUsed: { type: Number, default: 0, min: 0 },
      activeSince: { type: Date, default: null },
      activeSessionId: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;