const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getTodayLearning,
  getWord,
  saveLearningProgress,
  getProgress,
  getSummary,
  completeDaily,
  dailyStatus,
} = require("../controllers/learningController");

const router =
  express.Router();


// Today's new words
router.get(
  "/today",
  authMiddleware,
  getTodayLearning
);


router.get("/daily-status", authMiddleware, dailyStatus);
router.post("/daily-complete", authMiddleware, completeDaily);

// Backward-compatible alias used by the frontend
router.get(
  "/words",
  authMiddleware,
  getTodayLearning
);

// One word
router.get(
  "/word/:id",
  authMiddleware,
  getWord
);


// Save progress
router.post(
  "/progress",
  authMiddleware,
  saveLearningProgress
);


// All progress
router.get(
  "/progress",
  authMiddleware,
  getProgress
);


// Dashboard summary
router.get(
  "/summary",
  authMiddleware,
  getSummary
);


module.exports = router;