const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");
const { contentGuard } = require("../middleware/contentGuard");
const { aiUsageGuard } = require("../middleware/aiUsageGuard");

const { 
  startSession,
  sendMessage,
  getSessionMessages,
  getSpeakingHistory,
  endSession,
} = require("../controllers/speakingController");
const { analyzeSpeech } = require("../controllers/speakingFeedbackController");

const router =
  express.Router();


// Start new speaking session
router.post(
  "/start",
  authMiddleware,
  startSession
);


// Send message to AI friend
router.post(
  "/message",
  authMiddleware,
  aiUsageGuard,
  contentGuard,
  sendMessage
);


// Get all previous sessions
router.get(
  "/history",
  authMiddleware,
  getSpeakingHistory
);


// Get messages of one session
router.get(
  "/:sessionId/messages",
  authMiddleware,
  getSessionMessages
);


// End session
router.patch(
  "/:sessionId/end",
  authMiddleware,
  endSession
);

// Analyze pronunciation
router.post(
  "/analyze",
  authMiddleware,
  analyzeSpeech
);


module.exports = router;