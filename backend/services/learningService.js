const Word = require("../models/Word");
const User = require("../models/User");
const LearningProgress = require("../models/LearningProgress");

const levelMap = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced",
};

const buildQuiz = (word, pool) => {
  const sameLevel = pool.filter(
    (item) => item._id.toString() !== word._id.toString() && item.level === word.level
  );
  const distractors = sameLevel.slice(0, 3).map((item) => item.meaning);
  const options = [word.meaning, ...distractors].filter(Boolean);

  return {
    question: `What does “${word.word}” mean?`,
    options,
    answer: word.meaning,
    explanation: `${word.word} means: ${word.meaning}`,
  };
};

const enrichWords = (words, pool = words) =>
  words.map((word) => {
    const item = word.toObject ? word.toObject() : { ...word };
    item.pronunciation = item.pronunciation || "";
    item.hint = item.hindiHint || "";
    item.examples = (item.sentences || []).map((sentence) => sentence.text).filter(Boolean);
    item.quiz = buildQuiz(item, pool);
    return item;
  });

const getLearningWords = async ({ userId, level, limit = 5 }) => {
  const user = await User.findById(userId).select("learningLevel plan");
  const normalizedLevel = levelMap[level] || levelMap[user?.learningLevel] || "beginner";
  const planLimit = process.env.DEV_PLAN_BYPASS === "true" ? 5 : (user?.plan === "Advance" ? 5 : user?.plan === "Premium" ? 3 : 2);
  const requestedLimit = Number(limit);
  const dailyLimit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, planLimit) : planLimit;

  const progress = await LearningProgress.find({ userId }).select("wordId");
  const learnedWordIds = progress.map((item) => item.wordId);

  const query = {
    isActive: true,
    level: normalizedLevel,
    ...(learnedWordIds.length ? { _id: { $nin: learnedWordIds } } : {}),
  };

  let pool = await Word.find(query).sort({ sourceNumber: 1, createdAt: 1 }).limit(Math.max(dailyLimit + 6, 8));
  if (!pool.length && normalizedLevel === "beginner") {
    pool = await Word.find({ ...query, level: "intermediate" }).sort({ sourceNumber: 1, createdAt: 1 }).limit(Math.max(dailyLimit + 6, 8));
  }
  const words = pool.slice(0, dailyLimit);
  return enrichWords(words, pool);
};

const getUserProgress = async (userId) => {
  return LearningProgress.find({ userId }).populate("wordId").sort({ updatedAt: -1 });
};

const getWordById = async (wordId) => Word.findById(wordId);

const saveProgress = async ({ userId, wordId, status, score, correct }) => {
  let progress = await LearningProgress.findOne({ userId, wordId });
  const wasNew = !progress;

  if (!progress) progress = new LearningProgress({ userId, wordId });

  progress.attempts += 1;
  if (correct === true) progress.correctAnswers += 1;
  if (correct === false) progress.wrongAnswers += 1;
  if (score !== undefined) progress.score = Math.max(0, Math.min(100, Number(score) || 0));

  if (status === "completed") {
    progress.status = progress.score >= 80 ? "mastered" : "learned";
  } else if (status) {
    progress.status = status;
  } else if (progress.score >= 80) {
    progress.status = "mastered";
  } else if (progress.score >= 50) {
    progress.status = "learned";
  } else {
    progress.status = "learning";
  }

  progress.lastLearnedAt = new Date();
  progress.nextRevisionAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await progress.save();

  const user = await User.findById(userId);
  if (user) {
    if (wasNew) user.learningProgress.wordsLearned += 1;
    user.learningProgress.lastSessionDate = new Date();
    await user.save();
  }

  return progress.populate("wordId");
};

const completeDailyLearning = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  const today = new Date().toISOString().slice(0, 10);
  const last = user.learningProgress?.lastDailyCompletionDate || "";
  if (last === today) {
    return { streak: user.learningProgress?.streak || 0, alreadyCompleted: true, completedToday: true };
  }
  let streak = user.learningProgress?.streak || 0;
  if (last) {
    const previous = new Date(`${last}T00:00:00Z`);
    const current = new Date(`${today}T00:00:00Z`);
    const days = Math.round((current - previous) / 86400000);
    streak = days === 1 ? streak + 1 : 1;
  } else {
    streak = 1;
  }
  user.learningProgress.streak = streak;
  user.learningProgress.lastDailyCompletionDate = today;
  user.learningProgress.lastSessionDate = new Date();
  await user.save();
  return { streak, alreadyCompleted: false, completedToday: true };
};

const getDailyLearningStatus = async (userId) => {
  const user = await User.findById(userId).select("learningProgress");
  const today = new Date().toISOString().slice(0, 10);
  return { completedToday: user?.learningProgress?.lastDailyCompletionDate === today, streak: user?.learningProgress?.streak || 0 };
};

const getLearningSummary = async (userId) => {
  const [progress, user] = await Promise.all([
    LearningProgress.find({ userId }),
    User.findById(userId).select("learningProgress learningLevel"),
  ]);

  const total = progress.length;
  const learned = progress.filter((item) => item.status === "learned").length;
  const mastered = progress.filter((item) => item.status === "mastered").length;
  const learning = progress.filter((item) => item.status === "learning").length;
  const averageScore = total
    ? Math.round(progress.reduce((sum, item) => sum + item.score, 0) / total)
    : 0;

  return {
    totalWords: total,
    wordsLearned: user?.learningProgress?.wordsLearned || total,
    learning,
    learned,
    mastered,
    averageScore,
    percentage: averageScore,
    streak: user?.learningProgress?.streak || 0,
    sentencesPracticed: progress.reduce((sum, item) => sum + item.attempts, 0),
    sessions: new Set(progress.map((item) => item.lastLearnedAt?.toDateString()).filter(Boolean)).size,
    level: user?.learningLevel || "Beginner",
  };
};

module.exports = { getLearningWords, getUserProgress, getWordById, saveProgress, completeDailyLearning, getDailyLearningStatus, getLearningSummary };
