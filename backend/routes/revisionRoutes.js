const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getRevision,
  getSmartRevision,
  submitRevisionAnswer,
  getRevisionSummaryController,
} = require("../controllers/revisionController");

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
);


// Submit answer
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


module.exports = router;