const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const weeklyTestController = require("../controllers/weeklyTestController");

router.get("/generate", authMiddleware, weeklyTestController.generateWeeklyTest);
router.post("/submit", authMiddleware, weeklyTestController.submitWeeklyTest);

module.exports = router;
