const User = require('../models/User');
const LearningProgress = require('../models/LearningProgress');
const Challenge = require('../models/Challenge');
const Word = require('../models/Word');
const { generateAIResponse } = require('../services/aiService');
const { hierarchy } = require('../middleware/planGuard');

const getProfileContext = async (userId) => {
  const user = await User.findById(userId).select('plan learningLevel');
  const progress = await LearningProgress.find({ userId }).populate('wordId').sort({ updatedAt: -1 }).limit(12);
  const words = progress.map(p => p.wordId?.word).filter(Boolean);
  return { user, words };
};

const createPersonalChallenge = async (req, res) => {
  try {
    const type = req.params.type;
    if (!['daily', 'weekly', 'contest'].includes(type)) return res.status(400).json({ success: false, message: 'Invalid challenge type' });
    const { user, words } = await getProfileContext(req.user.userId);
    if (type === 'contest' && process.env.DEV_PLAN_BYPASS !== 'true' && hierarchy[user.plan || 'Basic'] < hierarchy.Premium) {
      return res.status(403).json({ success: false, code: 'PLAN_REQUIRED', requiredPlan: 'Premium', message: 'Contests are available on Premium and Advance plans.' });
    }

    const recentWord = words[0] || (await Word.findOne({ isActive: true, level: String(user.learningLevel || 'Beginner').toLowerCase() }))?.word || 'confidence';
    const titles = { daily: 'Your AI Daily Challenge', weekly: 'Your AI Weekly Challenge', contest: 'Speakly Open Contest' };
    const fallback = {
      daily: `Use “${recentWord}” naturally in a sentence and explain the situation in your own words.`,
      weekly: `Build a short story using ${Math.max(3, Math.min(8, words.length || 3))} words from your learning history.`,
      contest: `A LeetCode-style language challenge built around your current level and learned vocabulary.`,
    };
    let description = fallback[type];
    let aiPayload = { learnedWords: words, targetWord: recentWord };
    try {
      const raw = await generateAIResponse(`Create one ${type} English-learning challenge for a ${user.learningLevel} student. Personalize it using these learned words: ${words.join(', ') || recentWord}. Return ONLY JSON with {\"description\":\"short task\",\"taskType\":\"vocabulary|sentence|story|speaking\",\"targetWords\":[\"word\"]}. Keep it practical and different from a generic worksheet.`);
      const generated = JSON.parse(raw);
      description = generated.description || description;
      aiPayload = { ...aiPayload, ...generated };
    } catch (_) { /* deterministic fallback keeps challenges available when AI is not configured */ }
    const due = type === 'daily' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : type === 'weekly' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const challenge = await Challenge.create({ userId: req.user.userId, type, title: titles[type], description, payload: aiPayload, dueAt: due, status: type === 'contest' ? 'registered' : 'available' });
    res.json({ success: true, challenge });
  } catch (error) {
    console.error('Challenge error:', error);
    res.status(500).json({ success: false, message: 'Unable to create challenge' });
  }
};

const getChallenges = async (req, res) => {
  try {
    const items = await Challenge.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, challenges: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load challenges' });
  }
};

const completeChallenge = async (req, res) => {
  try {
    const item = await Challenge.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, { status: 'completed', completedAt: new Date() }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Challenge not found' });
    res.json({ success: true, challenge: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to complete challenge' });
  }
};

module.exports = { createPersonalChallenge, getChallenges, completeChallenge };
