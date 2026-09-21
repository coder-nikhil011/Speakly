const {
  explainUserText,
  extractVocabulary,
} = require("../services/storyAIService");

const {
  processDiscoveredWords,
} = require("../services/vocabularyService");


// ==========================================
// EXPLAIN SELECTED TEXT
// ==========================================

const explainText = async (req, res) => {
  try {
    const {
      text,
      selectedText,
      level,
    } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    if (!selectedText?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "selectedText is required",
      });
    }

    const result =
      await explainUserText({
        text: text.trim(),
        selectedText:
          selectedText.trim(),
        level:
          level || "intermediate",
      });

    // Add useful words found by AI
    const vocabulary =
      await processDiscoveredWords(
        result.usefulWords || [],
        level || "intermediate"
      );

    res.json({
      success: true,

      explanation: {
        explanation:
          result.explanation,

        contextMeaning:
          result.contextMeaning,

        hindiHint:
          result.hindiHint,

        example:
          result.example,
      },

      vocabulary: {
        added:
          vocabulary.added,

        existing:
          vocabulary.existing,
      },
    });
  } catch (error) {
    console.error(
      "Explain text error:",
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
// DISCOVER VOCABULARY
// ==========================================

const discoverVocabulary =
  async (req, res) => {
    try {
      const {
        text,
        level,
      } = req.body;

      if (!text?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Text is required",
        });
      }

      const result =
        await extractVocabulary({
          text: text.trim(),
          level:
            level || "intermediate",
        });

      const vocabulary =
        await processDiscoveredWords(
          result.words || [],
          level || "intermediate"
        );

      res.json({
        success: true,

        words:
          result.words || [],

        database: {
          added:
            vocabulary.added,

          existing:
            vocabulary.existing,
        },
      });
    } catch (error) {
      console.error(
        "Vocabulary discovery error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };


module.exports = {
  explainText,
  discoverVocabulary,
};