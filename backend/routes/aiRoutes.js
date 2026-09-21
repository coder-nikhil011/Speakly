const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  generateSentence,
} = require("../controllers/aiLearningController");

const router = express.Router();


// Generate contextual sentence
router.post(
  "/learning/sentence",
  authMiddleware,
  generateSentence
);


module.exports = router;