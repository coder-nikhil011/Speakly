const User = require("../models/User");
const Word = require("../models/Word");
const { generateAIResponse } = require("../services/aiService");

/**
 * Generate a comprehensive Weekly Progress Report.
 */
const generateWeeklyReport = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 1. Gather stats
    const totalWords = user.learningProgress.wordsLearned;
    const difficultWords = user.difficultWords;
    const masteredCount = difficultWords.filter(dw => dw.mastered).length;
    const strugglingCount = difficultWords.filter(dw => !dw.mastered).length;
    const strugglingWords = difficultWords.filter(dw => !dw.mastered).map(dw => dw.word);

    // 2. Prompt AI to analyze the data and generate a human-readable report
    const prompt = `
      You are a Language Learning Analyst.
      Generate a Weekly Progress Report for a ${user.learningLevel} student.
      
      Stats:
      - Total words encountered: ${totalWords}
      - Words marked as difficult: ${difficultWords.length}
      - Words mastered this week: ${masteredCount}
      - Words still struggling with: ${strugglingWords.join(", ")}
      
      The report should include:
      1. Executive Summary: A motivational overview of the week.
      2. Mastery Analysis: Which words were conquered and why.
      3. Focus Areas: Detailed advice on how to tackle the struggling words.
      4. Next Week's Goal: A suggested target for the next 7 days.
      
      Return ONLY valid JSON:
      {
        "summary": "...",
        "masteryAnalysis": "...",
        "focusAreas": "...",
        "nextWeekGoal": "...",
        "score": "A/B/C/D"
      }
    `;

    const response = await generateAIResponse(prompt);
    const reportData = JSON.parse(response);

    res.json({
      success: true,
      stats: {
        totalWords,
        masteredCount,
        strugglingCount,
      },
      report: reportData
    });
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({ success: false, message: "Error generating weekly report" });
  }
};

module.exports = {
  generateWeeklyReport,
};
