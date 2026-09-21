const User = require("../models/User");
const LearningProgress = require("../models/LearningProgress");
const { generateAIResponse } = require("../services/aiService");

const generateWeeklyTest = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentProgress = await LearningProgress.find({
      userId: req.user.userId,
      lastLearnedAt: { $gte: sevenDaysAgo },
    })
      .populate("wordId")
      .sort({ lastLearnedAt: -1 })
      .limit(15);

    const recentWords = recentProgress.map((item) => item.wordId).filter(Boolean);

    if (recentWords.length < 3) {
      return res.status(404).json({
        success: false,
        message: "Learn at least 3 words this week before taking the weekly test.",
      });
    }

    const wordList = recentWords
      .map((word) => `${word.word} (meaning: ${word.meaning})`)
      .join(", ");

    const prompt = `
You are a Language Proficiency Examiner.
Create a weekly vocabulary test for a ${user.learningLevel} student using ONLY these words:
${wordList}

Return ONLY valid JSON with:
{
  "story": "100-150 word story using the target words naturally",
  "questions": [
    { "id": 1, "text": "Sentence with ___", "correctAnswer": "target word", "options": ["target word", "wrong1", "wrong2", "wrong3"] }
  ],
  "answerKey": { "1": "target word" }
}
Create 5-10 questions and do not introduce vocabulary as target answers that is not in the supplied list.
Difficulty: ${user.learningLevel}.
`;

    const response = await generateAIResponse(prompt);
    const testData = JSON.parse(response);

    res.json({ success: true, data: testData, sourceWords: recentWords.map((w) => w.word) });
  } catch (error) {
    console.error("Weekly test generation error:", error);
    res.status(500).json({ success: false, message: "Error generating weekly test" });
  }
};

const submitWeeklyTest = async (req, res) => {
  try {
    const { answers = {}, testData } = req.body;
    if (!testData?.questions?.length) {
      return res.status(400).json({ success: false, message: "Invalid test data" });
    }

    let correctCount = 0;
    for (const q of testData.questions) {
      if (answers[q.id] === q.correctAnswer) correctCount += 1;
    }

    const totalQuestions = testData.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    res.json({
      success: true,
      score,
      correctCount,
      totalQuestions,
      message: score >= 80
        ? "Excellent! Your weekly vocabulary recall is strong."
        : "Good effort. Revisit the words you missed and try again.",
    });
  } catch (error) {
    console.error("Weekly test submission error:", error);
    res.status(500).json({ success: false, message: "Error submitting test" });
  }
};

module.exports = { generateWeeklyTest, submitWeeklyTest };
