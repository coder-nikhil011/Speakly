const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { contentGuard } = require("../middleware/contentGuard");
const { aiUsageGuard } = require("../middleware/aiUsageGuard");
const aiTutorController = require("../controllers/aiTutorController");

router.get("/greeting", authMiddleware, aiTutorController.getDailyGreeting);
router.post("/teach", authMiddleware, aiUsageGuard, contentGuard, aiTutorController.teachWord);
router.post("/note-down", authMiddleware, contentGuard, aiTutorController.noteDownWord);

module.exports = router;
