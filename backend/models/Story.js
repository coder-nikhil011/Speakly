const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: [
        "beginner",
        "elementary",
        "intermediate",
        "upper-intermediate",
        "advanced",
      ],
      default: "beginner",
    },

    type: {
      type: String,
      enum: [
        "ai_generated",
        "user_submitted",
      ],
      required: true,
    },

    topic: {
      type: String,
      default: "",
    },

    targetWords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Word",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Story",
  storySchema
);