const {
  getLearningWords,
  getUserProgress,
  getWordById,
  saveProgress,
  getLearningSummary,
  completeDailyLearning,
  getDailyLearningStatus,
} = require("../services/learningService");


// ==========================================
// TODAY'S LEARNING
// ==========================================

const getTodayLearning = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message:
          "Student access only",
      });
    }

    const words =
      await getLearningWords({
        userId: req.user.userId,
        level:
          req.query.level,
        limit:
          Number(req.query.limit) || 5,
      });

    res.json({
      success: true,
      words,
    });
  } catch (error) {
    console.error(
      "Today learning error:",
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
// GET ONE WORD
// ==========================================

const getWord = async (
  req,
  res
) => {
  try {
    const word =
      await getWordById(
        req.params.id
      );

    if (!word) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    res.json({
      success: true,
      word,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// SAVE PROGRESS
// ==========================================

const saveLearningProgress =
  async (req, res) => {
    try {
      if (
        req.user.role !==
        "student"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Student access only",
        });
      }

      const {
        wordId,
        status,
        score,
        correct,
      } = req.body;

      if (!wordId) {
        return res.status(400).json({
          success: false,
          message:
            "wordId is required",
        });
      }

      const progress =
        await saveProgress({
          userId:
            req.user.userId,
          wordId,
          status,
          score,
          correct,
        });

      res.json({
        success: true,
        message:
          "Learning progress saved",
        progress,
      });
    } catch (error) {
      console.error(
        "Save learning progress:",
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
// GET PROGRESS
// ==========================================

const getProgress = async (
  req,
  res
) => {
  try {
    const progress =
      await getUserProgress(
        req.user.userId
      );

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
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

const getSummary = async (
  req,
  res
) => {
  try {
    const summary =
      await getLearningSummary(
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


const completeDaily = async (req, res) => {
  try {
    const status = await completeDailyLearning(req.user.userId);
    res.json({ success: true, ...status });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to complete today's learning" });
  }
};

const dailyStatus = async (req, res) => {
  try {
    const status = await getDailyLearningStatus(req.user.userId);
    res.json({ success: true, ...status });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to read today's learning status" });
  }
};

module.exports = {
  getTodayLearning,
  completeDaily,
  dailyStatus,
  getWord,
  saveLearningProgress,
  getProgress,
  getSummary,
};