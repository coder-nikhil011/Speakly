const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePlan } = require("../middleware/planGuard");

const {
  createWord,
  createSentence,
  getTeacherWords,
  getWordDetails,
  updateWord,
  updateSentence,
  deleteSentence,
  getStudentProgress,
  createLesson,
  getTeacherLessons,
  updateLesson,
  deleteLesson,
  getMyTeacherLessons,
} = require("../controllers/teacherContentController");

const router = express.Router();


// ========================================
// WORDS
// ========================================

// Create word
router.post(
  "/words",
  authMiddleware,
  createWord
);


// Get all words
router.get(
  "/words",
  authMiddleware,
  getTeacherWords
);


// Get word + sentences
router.get(
  "/words/:wordId",
  authMiddleware,
  getWordDetails
);


// Update word
router.patch(
  "/words/:wordId",
  authMiddleware,
  updateWord
);


// ========================================
// SENTENCES
// ========================================

// Add sentence to word
router.post(
  "/words/:wordId/sentences",
  authMiddleware,
  createSentence
);


// Update sentence
router.patch(
  "/sentences/:sentenceId",
  authMiddleware,
  updateSentence
);


// Remove sentence
router.delete(
  "/sentences/:sentenceId",
  authMiddleware,
  deleteSentence
);


// ========================================
// STUDENT PROGRESS
// ========================================

router.get(
  "/students/progress",
  authMiddleware,
  getStudentProgress
);


// ========================================
// LESSONS
// ========================================

// Create lesson
router.post(
  "/lessons",
  authMiddleware,
  createLesson
);

// Get my lessons (Teacher)
router.get(
  "/lessons",
  authMiddleware,
  getTeacherLessons
);

// Update lesson
router.patch(
  "/lessons/:id",
  authMiddleware,
  updateLesson
);

// Delete lesson
router.delete(
  "/lessons/:id",
  authMiddleware,
  deleteLesson
);

// Get lessons from my teacher (Student)
router.get(
  "/my-teacher-lessons",
  authMiddleware,
  requirePlan("Premium"),
  getMyTeacherLessons
);


module.exports = router;