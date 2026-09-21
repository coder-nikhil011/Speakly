const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  explainText,
  discoverVocabulary,
} = require("../controllers/textLearningController");

const router = express.Router();


// Explain selected word/sentence
router.post(
  "/explain",
  authMiddleware,
  explainText
);


// Find useful vocabulary
router.post(
  "/discover-vocabulary",
  authMiddleware,
  discoverVocabulary
);


module.exports = router;