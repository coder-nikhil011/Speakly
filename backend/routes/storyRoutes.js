const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  createStory,
  getStories,
} = require("../controllers/storyController");

const router = express.Router();


// Generate story
router.post(
  "/generate",
  authMiddleware,
  createStory
);


// Get user's stories
router.get(
  "/",
  authMiddleware,
  getStories
);


module.exports = router;