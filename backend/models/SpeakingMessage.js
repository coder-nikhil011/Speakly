const mongoose = require("mongoose");

const speakingMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpeakingSession",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    correction: {
      original: {
        type: String,
        default: "",
      },

      corrected: {
        type: String,
        default: "",
      },

      explanation: {
        type: String,
        default: "",
      },
    },

    newWords: [
      {
        word: {
          type: String,
          trim: true,
        },

        meaning: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SpeakingMessage",
  speakingMessageSchema
);