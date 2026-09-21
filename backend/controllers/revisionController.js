const {
  getRevisionWords,
  getSmartRevisionWords,
  saveRevisionResult,
  getRevisionSummary,
} = require("../services/revisionService");


// ==========================================
// NORMAL REVISION
// ==========================================

const getRevision = async (
  req,
  res
) => {
  try {
    const words =
      await getRevisionWords(
        req.user.userId,
        Number(req.query.limit) || 10
      );

    res.json({
      success: true,
      count: words.length,
      words,
    });

  } catch (error) {
    console.error(
      "Revision error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// SMART REVISION
// ==========================================

const getSmartRevision = async (
  req,
  res
) => {
  try {
    const words =
      await getSmartRevisionWords(
        req.user.userId,
        Number(req.query.limit) || 10
      );

    const pool = words
      .map((item) => item.wordId)
      .filter(Boolean);

    const questions = words.map((item) => {
      const word = item.wordId;
      const distractors = pool
        .filter((candidate) => candidate._id.toString() !== word._id.toString())
        .slice(0, 2)
        .map((candidate) => candidate.meaning);

      return {
        _id: word._id,
        word: word.word,
        question: `What does “${word.word}” mean?`,
        options: [word.meaning, ...distractors],
        answer: word.meaning,
        explanation: `${word.word} means: ${word.meaning}`,
      };
    });

    res.json({
      success: true,
      count: questions.length,
      questions,
      words,
    });

  } catch (error) {
    console.error(
      "Smart revision error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// SUBMIT ANSWER
// ==========================================

const submitRevisionAnswer =
  async (req, res) => {
    try {
      const {
        wordId,
        correct,
        isCorrect,
      } = req.body;

      const finalCorrect = typeof correct === "boolean" ? correct : isCorrect;

      if (!wordId) {
        return res.status(400).json({
          success: false,
          message:
            "wordId is required",
        });
      }

      if (
        typeof finalCorrect !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "correct must be true or false",
        });
      }

      const progress =
        await saveRevisionResult({
          userId:
            req.user.userId,
          wordId,
          correct: finalCorrect,
        });

      res.json({
        success: true,
        message:
          "Revision result saved",
        progress,
      });

    } catch (error) {
      console.error(
        "Submit revision:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };


// ==========================================
// SUMMARY
// ==========================================

const getRevisionSummaryController =
  async (req, res) => {
    try {
      const summary =
        await getRevisionSummary(
          req.user.userId
        );

      res.json({
        success: true,
        summary,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };


module.exports = {
  getRevision,
  getSmartRevision,
  submitRevisionAnswer,
  getRevisionSummaryController,
};