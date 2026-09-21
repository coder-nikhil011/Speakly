const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  submitFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();


router.post(
  "/",
  authMiddleware,
  submitFeedback
);


module.exports = router;