const LearningProgress = require("../models/LearningProgress");

// ==========================================
// GET WORDS DUE FOR REVISION
// ==========================================

const getRevisionWords = async (userId, limit = 10) => {
  const now = new Date();

  return await LearningProgress.find({
    userId,
    nextRevisionAt: {
      $lte: now,
    },
  })
    .populate("wordId")
    .sort({
      nextRevisionAt: 1,
    })
    .limit(limit);
};


// ==========================================
// GET SMART REVISION WORDS
// ==========================================

const getSmartRevisionWords = async (
  userId,
  limit = 10
) => {
  return await LearningProgress.find({
    userId,
  })
    .populate("wordId")
    .sort({
      score: 1,
      revisionScore: 1,
      updatedAt: 1,
    })
    .limit(limit);
};


// ==========================================
// UPDATE REVISION RESULT
// ==========================================

const saveRevisionResult = async ({
  userId,
  wordId,
  correct,
}) => {
  const progress =
    await LearningProgress.findOne({
      userId,
      wordId,
    });

  if (!progress) {
    throw new Error(
      "Learning progress not found"
    );
  }

  progress.revisionAttempts += 1;

  if (correct) {
    progress.revisionScore += 1;
    progress.correctAnswers += 1;
  } else {
    progress.revisionScore -= 1;
    progress.wrongAnswers += 1;
  }

  // Keep score between 0 and 100
  const totalAttempts =
    progress.correctAnswers +
    progress.wrongAnswers;

  if (totalAttempts > 0) {
    progress.score = Math.round(
      (progress.correctAnswers /
        totalAttempts) *
        100
    );
  }

  // ------------------------------------------
  // Decide learning status
  // ------------------------------------------

  if (progress.score >= 85) {
    progress.status = "mastered";
  } else if (progress.score >= 60) {
    progress.status = "learned";
  } else {
    progress.status = "learning";
  }

  // ------------------------------------------
  // Spaced revision
  // ------------------------------------------

  let days = 1;

  if (correct) {
    if (progress.revisionAttempts >= 5) {
      days = 14;
    } else if (
      progress.revisionAttempts >= 4
    ) {
      days = 7;
    } else if (
      progress.revisionAttempts >= 3
    ) {
      days = 4;
    } else if (
      progress.revisionAttempts >= 2
    ) {
      days = 2;
    }
  } else {
    // Wrong answer → revise sooner
    days = 1;
  }

  progress.lastRevisionAt =
    new Date();

  progress.nextRevisionAt =
    new Date(
      Date.now() +
        days *
          24 *
          60 *
          60 *
          1000
    );

  await progress.save();

  return await progress.populate(
    "wordId"
  );
};


// ==========================================
// REVISION SUMMARY
// ==========================================

const getRevisionSummary = async (
  userId
) => {
  const now = new Date();

  const due =
    await LearningProgress.countDocuments({
      userId,
      nextRevisionAt: {
        $lte: now,
      },
    });

  const total =
    await LearningProgress.countDocuments({
      userId,
    });

  const mastered =
    await LearningProgress.countDocuments({
      userId,
      status: "mastered",
    });

  return {
    dueForRevision: due,
    totalLearnedWords: total,
    masteredWords: mastered,
  };
};


module.exports = {
  getRevisionWords,
  getSmartRevisionWords,
  saveRevisionResult,
  getRevisionSummary,
};