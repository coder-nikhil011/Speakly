const mongoose = require("mongoose");

const learningFeedbackSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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

      type: {
        type: String,
        enum: [
          "not_understood",
          "too_difficult",
          "sentence_unclear",
          "understood",
        ],
        required: true,
      },

      message: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "LearningFeedback",
    learningFeedbackSchema
  );