const mongoose = require("mongoose");

const revisionSchema = new mongoose.Schema(
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
    },

    sentenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sentence",
      default: null,
    },

    question: {
      type: String,
      required: true,
    },

    questionType: {
      type: String,
      enum: [
        "meaning",
        "fill_blank",
        "sentence_choice",
        "context",
      ],
      required: true,
    },

    options: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: String,
      required: true,
    },

    userAnswer: {
      type: String,
      default: "",
    },

    isCorrect: {
      type: Boolean,
      default: null,
    },

    answeredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Revision",
  revisionSchema
);