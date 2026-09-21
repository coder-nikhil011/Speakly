const fs = require('fs');
const path = require('path');
const LearningContentProgress = require('../models/LearningContentProgress');

const library = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/contentLibrary.json'), 'utf8'));

const normalize = (value) => String(value || '').trim().toLowerCase();

const getAvailable = async (userId, type, items) => {
  const done = await LearningContentProgress.find({ userId, contentType: type }).select('contentKey');
  const used = new Set(done.map((item) => item.contentKey));
  return items.filter((item) => {
    const key = normalize(type === 'sentence' ? item.text : type === 'phrase' ? item.phrase : item.modal);
    return key && !used.has(key);
  });
};

const getTodayContent = async (userId, wordCount = 2) => {
  const [sentences, phrases, modals] = await Promise.all([
    getAvailable(userId, 'sentence', library.sentences),
    getAvailable(userId, 'phrase', library.phrases),
    getAvailable(userId, 'modal', library.modalVerbs),
  ]);

  return {
    sentences: sentences.slice(0, 1),
    phrases: phrases.slice(0, 1),
    modals: modals.slice(0, 1),
    wordCount,
  };
};

const saveContentProgress = async ({ userId, contentType, contentKey, contentText, correct = false }) => {
  const progress = await LearningContentProgress.findOneAndUpdate(
    { userId, contentType, contentKey: normalize(contentKey) },
    {
      $set: { contentText, lastPracticedAt: new Date(), completed: true },
      $inc: { attempts: 1, correctAttempts: correct ? 1 : 0 },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return progress;
};

const getContentHistory = async (userId) =>
  LearningContentProgress.find({ userId }).sort({ lastPracticedAt: -1 });

module.exports = { getTodayContent, saveContentProgress, getContentHistory };
