const mongoose = require("mongoose");

const sentenceSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    hindiHint: {
      type: String,
      default: "",
      trim: true,
    },

    grammarHint: {
      type: String,
      default: "",
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
  },
  {
    _id: false,
  }
);

const wordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    sourceNumber: {
      type: Number,
      index: true,
    },

    meaning: {
      type: String,
      required: true,
      trim: true,
    },

    hindiHint: {
      type: String,
      default: "",
      trim: true,
    },

    partOfSpeech: {
      type: String,
      default: "",
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

    category: {
      type: String,
      default: "general",
      trim: true,
    },

    sentences: {
      type: [sentenceSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    source: {
      type: String,
      enum: [
        "admin",
        "teacher",
        "ai",
        "user",
      ],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("Word", wordSchema);