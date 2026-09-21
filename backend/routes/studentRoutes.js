const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/studentController");

const router = express.Router();


// Protected routes

router.get(
  "/profile",
  authMiddleware,
  getStudentProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateStudentProfile
);


module.exports = router;