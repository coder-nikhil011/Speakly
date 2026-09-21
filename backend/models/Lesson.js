const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: String, // Can be markdown or HTML
      required: true,
    },
    materials: [
      {
        name: String,
        url: String,
        type: { type: String, enum: ["pdf", "video", "link"], default: "link" },
      },
    ],
    vocabulary: [
      {
        word: String,
        meaning: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);
