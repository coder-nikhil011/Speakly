const express = require("express");
const router = express.Router();
const { updateProfile, getProfile } = require("../controllers/profileController");
const protect = require("../middleware/authMiddleware");

router.route("/update").put(protect, updateProfile);
router.route("/me").get(protect, getProfile);

module.exports = router;
