const {
  generateStory,
} = require("../services/storyAIService");

const {
  processDiscoveredWords,
} = require("../services/vocabularyService");


// ==========================================
// GENERATE STORY
// ==========================================

const createStory = async (req, res) => {
  try {
    const {
      topic,
      level,
      targetWords = [],
    } = req.body;

    if (!topic?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const result = await generateStory({
      topic: topic.trim(),
      level: level || "intermediate",
      targetWords,
    });

    // Add useful AI-discovered words to DB
    const vocabulary =
      await processDiscoveredWords(
        result.importantWords || [],
        level || "intermediate"
      );

    res.status(201).json({
      success: true,
      story: result,
      vocabulary: {
        added: vocabulary.added,
        existing: vocabulary.existing,
      },
    });
  } catch (error) {
    console.error(
      "Create story error:",
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
// GET USER STORIES
// ==========================================

const getStories = async (req, res) => {
  try {
    // This will be connected to Story model
    // when story history persistence is enabled.

    res.json({
      success: true,
      stories: [],
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
  createStory,
  getStories,
};