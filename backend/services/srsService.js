const LearningProgress = require('../models/LearningProgress');

const srsService = {
  async calculateNextReview(userId, wordId, quality) {
    // quality: 0 (forgot) to 5 (perfect)
    try {
      const progress = await LearningProgress.findOne({ userId, wordId });
      if (!progress) return;

      let { srsInterval, srsEaseFactor } = progress;

      // SM2 Simplified Algorithm
      if (quality >= 3) {
        if (srsInterval === 1) {
          srsInterval = 6;
        } else if (srsInterval === 6) {
          srsInterval = 7;
        } else {
          srsInterval = Math.round(srsInterval * srsEaseFactor);
        }
        srsEaseFactor = srsEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      } else {
        srsInterval = 1;
        srsEaseFactor = srsEaseFactor - 0.15;
      }

      if (srsEaseFactor < 1.3) srsEaseFactor = 1.3;

      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + srsInterval);

      await LearningProgress.findOneAndUpdate(
        { userId, wordId },
        { srsInterval, srsEaseFactor, nextReviewDate },
        { new: true }
      );

      return { srsInterval, nextReviewDate };
    } catch (err) {
      console.error('SRS Calculation Error:', err);
    }
  },

  async getDueWords(userId) {
    try {
      const now = new Date();
      return await LearningProgress.find({
        userId,
        nextReviewDate: { $lte: now }
      }).populate('wordId');
    } catch (err) {
      console.error('Get Due Words Error:', err);
    }
  }
};

module.exports = srsService;
