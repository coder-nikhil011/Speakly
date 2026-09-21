const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getTeachingAssistant } = require("../controllers/teacherAssistantController");

const router = express.Router();

router.post(
  "/assist",
  authMiddleware,
  getTeachingAssistant
);

module.exports = router;
