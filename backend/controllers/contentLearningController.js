const User = require('../models/User');
const { getTodayContent, saveContentProgress, getContentHistory } = require('../services/contentLearningService');

const rank = { Basic: 0, Premium: 1, Advance: 2 };

const getTodayClass = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('plan learningLevel learningProgress');
    const wordCount = process.env.DEV_PLAN_BYPASS === 'true' ? 5 : (user?.plan === 'Advance' ? 5 : user?.plan === 'Premium' ? 3 : 2);
    const content = await getTodayContent(req.user.userId, wordCount);
    const today = new Date().toISOString().slice(0, 10);
    const completedToday = user?.learningProgress?.lastDailyCompletionDate === today;
    res.json({ success: true, content: completedToday ? { sentences: [], phrases: [], modals: [] } : content, completedToday, streak: user?.learningProgress?.streak || 0 });
  } catch (error) {
    console.error('Today class error:', error);
    res.status(500).json({ success: false, message: 'Unable to load today\'s class' });
  }
};

const saveContent = async (req, res) => {
  try {
    const { contentType, contentKey, contentText, correct } = req.body;
    if (!['sentence', 'phrase', 'modal'].includes(contentType) || !contentKey || !contentText) {
      return res.status(400).json({ success: false, message: 'Valid contentType, contentKey and contentText are required' });
    }
    const progress = await saveContentProgress({ userId: req.user.userId, contentType, contentKey, contentText, correct });
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to save practice' });
  }
};

const history = async (req, res) => {
  try {
    const items = await getContentHistory(req.user.userId);
    res.json({ success: true, history: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load content history' });
  }
};

module.exports = { getTodayClass, saveContent, history };
