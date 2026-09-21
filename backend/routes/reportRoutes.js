const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const reportController = require("../controllers/reportController");

router.get("/generate", authMiddleware, reportController.generateWeeklyReport);

module.exports = router;
