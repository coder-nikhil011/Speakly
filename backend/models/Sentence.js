const mongoose = require("mongoose");

const sentenceSchema = new mongoose.Schema(
  {
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Word",
      required: true,
      index: true,
    },

    sentence: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
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

    context: {
      type: String,
      default: "",
    },

    hindiHint: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Sentence",
  sentenceSchema
);