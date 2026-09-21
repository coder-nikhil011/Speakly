const User = require("../models/User");
const { generateLearningSentence, generateRevisionQuestion } = require("../services/aiService");
const { awardXP, updateStreak } = require("../services/gamificationService");
const { consumeAIMinute } = require("../middleware/aiUsageGuard");

/**
 * Handle the AI Tutor greeting and daily check-in.
 * Checks if previous day's work was completed.
 */
const getDailyGreeting = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const today = new Date();
    const lastSession = user.learningProgress.lastSessionDate;
    let greeting = "Hello! Ready to learn some new words today?";
    let workPending = false;
    if (lastSession) {
      const diffDays = Math.floor((today - lastSession) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        greeting = "Welcome back! You have a new class waiting. Your streak only changes when you complete the full daily task.";
        workPending = true;
      }
    }

    res.json({
      success: true,
      greeting,
      workPending,
      streak: user.learningProgress.streak
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching greeting" });
  }
};

/**
 * AI Tutor Teaching Flow:
 * Explains a word with Meaning -> Usage -> Situation -> Examples.
 */
const teachWord = async (req, res) => {
  try {
    const { word } = req.body; // Expecting the word string
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Get difficult words to inject into the session
    const difficultWords = user.difficultWords
      .filter(dw => !dw.mastered)
      .map(dw => dw.word);

    const prompt = `
      You are a professional Language Tutor. 
      Teach the word: "${word}" to a ${user.learningLevel} level student.
      
      Include the following sections in your response:
      1. Meaning: Clear and simple definition.
      2. Usage: Where this word is commonly used (e.g., Formal, Casual, Business).
      3. Situation: A specific real-life scenario where this word is the best choice.
      4. How to use: Grammatical guidance (e.g., used with 'to', usually an adjective).
      5. Examples: 3 diverse sentences using the word.
      
      Context: The user is also struggling with these words: ${difficultWords.join(", ")}. 
      If possible, create one of the examples using both the target word and one of the difficult words.
      
      Return ONLY valid JSON:
      {
        "meaning": "...",
        "usage": "...",
        "situation": "...",
        "howToUse": "...",
        "examples": ["...", "...", "..."]
      }
    `;

    // Using a generic AI response here, we'll integrate it with aiService.js
    const { generateAIResponse } = require("../services/aiService"); 
    const response = await generateAIResponse(prompt);
    
    await consumeAIMinute(req.user.userId);
    await awardXP(req.user.userId, 50, "Learned a new word with AI Tutor");
    await updateStreak(req.user.userId);
    res.json({
      success: true,
      data: JSON.parse(response)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error teaching word" });
  }
};

/**
 * Handle "Note Down" difficult words.
 */
const noteDownWord = async (req, res) => {
  try {
    const { word } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const exists = user.difficultWords.find(dw => dw.word.toLowerCase() === word.toLowerCase());
    if (!exists) {
      user.difficultWords.push({ word });
      await user.save();
    }

    res.json({ success: true, message: `"${word}" added to your revision list.` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding word" });
  }
};

module.exports = {
  getDailyGreeting,
  teachWord,
  noteDownWord,
};
