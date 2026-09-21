const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getTeacherProfile,
  updateTeacherProfile,
} = require("../controllers/teacherController");

const router = express.Router();


router.get(
  "/profile",
  authMiddleware,
  getTeacherProfile
);


router.put(
  "/profile",
  authMiddleware,
  updateTeacherProfile
);


module.exports = router;