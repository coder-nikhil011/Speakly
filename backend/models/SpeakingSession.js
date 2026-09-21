const mongoose = require("mongoose");

const speakingSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    friendName: {
      type: String,
      default: "Alex",
      trim: true,
    },

    voice: {
      type: String,
      default: "female",
      enum: ["male", "female"],
    },

    personality: {
      type: String,
      default: "friendly",
      trim: true,
    },

    level: {
      type: String,
      default: "intermediate",
      enum: [
        "beginner",
        "elementary",
        "intermediate",
        "upper-intermediate",
        "advanced",
      ],
    },

    topic: {
      type: String,
      default: "General Conversation",
      trim: true,
    },

    story: { type: String, default: "", trim: true },
    preferredLanguage: { type: String, default: "auto", enum: ["auto", "english", "hindi", "hinglish"] },
    mode: { type: String, default: "chat", enum: ["chat", "video"] },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    totalMessages: {
      type: Number,
      default: 0,
    },

    speakingScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SpeakingSession",
  speakingSessionSchema
);