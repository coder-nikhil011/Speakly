const Word = require("../models/Word");

/**
 * Scans text for potential new words and adds them to the database if they don't exist.
 * This ensures the Word Bank grows automatically from teacher stories and AI conversations.
 */
const autoSyncWords = async (text, source = "ai", level = "beginner") => {
  try {
    if (!text) return [];

    // Basic tokenization: split by spaces and remove punctuation
    const words = text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&*()_+-={}\[\]"':;?]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 3); // Only sync words longer than 3 chars to avoid "the", "is", "a"

    const uniqueWords = [...new Set(words)];
    const newlyCreated = [];

    for (const wordStr of uniqueWords) {
      const existingWord = await Word.findOne({ word: wordStr });
      
      if (!existingWord) {
        const newWord = await Word.create({
          word: wordStr,
          meaning: "Auto-captured from content", // Placeholder, can be updated by AI later
          level: level,
          source: source,
          category: "general"
        });
        newlyCreated.push(newWord);
      }
    }

    return newlyCreated;
  } catch (error) {
    console.error("Auto-sync words error:", error);
    return [];
  }
};

module.exports = { autoSyncWords };
