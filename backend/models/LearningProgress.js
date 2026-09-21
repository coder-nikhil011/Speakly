const mongoose = require("mongoose");

const learningProgressSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      wordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Word",
        required: true,
        index: true,
      },

      status: {
        type: String,
        enum: [
          "new",
          "learning",
          "learned",
          "mastered",
        ],
        default: "new",
      },

      score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      attempts: {
        type: Number,
        default: 0,
      },

      correctAnswers: {
        type: Number,
        default: 0,
      },

      wrongAnswers: {
        type: Number,
        default: 0,
      },

      revisionAttempts: {
        type: Number,
        default: 0,
      },

      revisionScore: {
        type: Number,
        default: 0,
      },

      lastLearnedAt: {
        type: Date,
        default: null,
      },

      lastRevisionAt: {
        type: Date,
        default: null,
      },

      nextRevisionAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

learningProgressSchema.index(
  {
    userId: 1,
    wordId: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.model(
    "LearningProgress",
    learningProgressSchema
  );