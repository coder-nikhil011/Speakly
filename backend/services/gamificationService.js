const User = require("../models/User");

/**
 * Gamification Service to handle XP and Levels
 */

const XP_PER_LEVEL = 500; // XP needed to level up

const awardXP = async (userId, amount, reason = "") => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const oldXP = user.learningProgress.totalXP;
    const newXP = oldXP + amount;
    
    user.learningProgress.totalXP = newXP;

    // Calculate Level based on total XP
    // Level = floor(totalXP / XP_PER_LEVEL) + 1
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
    let leveledUp = false;

    if (newLevel > user.learningProgress.currentLevel) {
      user.learningProgress.currentLevel = newLevel;
      leveledUp = true;
    }

    await user.save();

    return {
      success: true,
      xpAwarded: amount,
      totalXP: newXP,
      currentLevel: user.learningProgress.currentLevel,
      leveledUp,
      reason
    };
  } catch (error) {
    console.error("XP Award Error:", error);
    throw error;
  }
};

/**
 * Update daily streak
 * Logic: 
 * - If last completion was yesterday -> streak++
 * - If last completion was today -> do nothing
 * - If last completion was > 1 day ago -> streak = 1
 */
const updateStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const today = new Date().toISOString().split('T')[0];
    const lastDate = user.learningProgress.lastDailyCompletionDate;

    if (lastDate === today) {
      return { success: true, streak: user.learningProgress.streak, updated: false };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === yesterdayStr) {
      user.learningProgress.streak += 1;
    } else {
      user.learningProgress.streak = 1;
    }

    user.learningProgress.lastDailyCompletionDate = today;
    await user.save();

    return { 
      success: true, 
      streak: user.learningProgress.streak, 
      updated: true 
    };
  } catch (error) {
    console.error("Streak Update Error:", error);
    throw error;
  }
};

module.exports = {
  awardXP,
  updateStreak,
  XP_PER_LEVEL
};
