const { protect } = require('../middleware/authMiddleware');
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getRevision, getSmartRevision, submitRevisionAnswer, getRevisionSummaryController,} = require("../controllers/revisionController");

const router =
  express.Router();
// Normal revision
router.get(
  "/",
  authMiddleware,
  getRevision
);
// Smart revision
router.get(
  "/smart",
  authMiddleware,
  getSmartRevision
);// Submit answer
router.post(
  "/answer",
  authMiddleware,
  submitRevisionAnswer
);
// Revision summary
router.get(
  "/summary",
  authMiddleware,
  getRevisionSummaryController
);


router.get('/due', protect, async (req, res) => {
  try {
    const dueWords = await srsService.getDueWords(req.user.userId);
    res.json({ success: true, dueWords });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/update', protect, async (req, res) => {
  try {
    const { wordId, quality } = req.body;
    const result = await srsService.calculateNextReview(req.user.userId, wordId, quality);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
module.exports = router;