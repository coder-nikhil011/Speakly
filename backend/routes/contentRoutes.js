const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getContentLibrary } = require("../controllers/contentController");

const router = express.Router();
router.get("/library", authMiddleware, getContentLibrary);

module.exports = router;
