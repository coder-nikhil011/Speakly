const crypto = require('crypto');
const User = require('../models/User');

// AI time is real active AI-session time, not time spent with the app open.
const LIMITS = { Basic: 2 * 60 * 60, Premium: 5 * 60 * 60, Advance: 10 * 60 * 60 };

const todayKey = () => new Date().toISOString().slice(0, 10);

const syncActiveUsage = async (user) => {
  const today = todayKey();
  if (!user.aiUsage || user.aiUsage.date !== today) {
    user.aiUsage = { date: today, minutesUsed: 0, secondsUsed: 0, activeSince: null, activeSessionId: '' };
  }
  if (user.aiUsage.activeSince) {
    const elapsed = Math.max(0, Math.floor((Date.now() - new Date(user.aiUsage.activeSince).getTime()) / 1000));
    if (elapsed > 0) {
      user.aiUsage.secondsUsed = Math.max(0, Number(user.aiUsage.secondsUsed || 0) + elapsed);
      user.aiUsage.minutesUsed = user.aiUsage.secondsUsed / 60;
      user.aiUsage.activeSince = new Date();
      await user.save();
    }
  }
  return user;
};

const aiUsageGuard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('plan aiUsage');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await syncActiveUsage(user);
    const effectivePlan = process.env.DEV_PLAN_BYPASS === 'true' ? 'Advance' : (user.plan || 'Basic');
    const limitSeconds = LIMITS[effectivePlan];
    const usedSeconds = Number(user.aiUsage?.secondsUsed || 0);
    if (usedSeconds >= limitSeconds) {
      return res.status(429).json({
        success: false,
        code: 'AI_DAILY_LIMIT',
        message: `Your ${user.plan || 'Basic'} plan has reached its daily AI time limit of ${Math.round(limitSeconds / 3600)} hours.`,
        usedSeconds,
        limitSeconds,
        usedMinutes: Math.floor(usedSeconds / 60),
        limitMinutes: Math.floor(limitSeconds / 60),
      });
    }
    req.aiUsage = { user, limitSeconds };
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to verify AI usage limit' });
  }
};

const startAISession = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  await syncActiveUsage(user);
  const effectivePlan = process.env.DEV_PLAN_BYPASS === 'true' ? 'Advance' : (user.plan || 'Basic');
  const limitSeconds = LIMITS[effectivePlan];
  if (Number(user.aiUsage.secondsUsed || 0) >= limitSeconds) {
    const error = new Error('AI daily limit reached');
    error.code = 'AI_DAILY_LIMIT';
    throw error;
  }
  const sessionId = crypto.randomBytes(12).toString('hex');
  user.aiUsage.activeSessionId = sessionId;
  user.aiUsage.activeSince = new Date();
  await user.save();
  return { sessionId, usedSeconds: Number(user.aiUsage.secondsUsed || 0), limitSeconds };
};

const heartbeatAISession = async (userId, sessionId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  await syncActiveUsage(user);
  if (user.aiUsage.activeSessionId !== sessionId) { const effectivePlan = process.env.DEV_PLAN_BYPASS === 'true' ? 'Advance' : (user.plan || 'Basic'); return { usedSeconds: Number(user.aiUsage.secondsUsed || 0), limitSeconds: LIMITS[effectivePlan], active: false }; }
  const effectivePlan = process.env.DEV_PLAN_BYPASS === 'true' ? 'Advance' : (user.plan || 'Basic');
  const limitSeconds = LIMITS[effectivePlan];
  const usedSeconds = Number(user.aiUsage.secondsUsed || 0);
  if (usedSeconds >= limitSeconds) {
    user.aiUsage.activeSince = null;
    user.aiUsage.activeSessionId = '';
    await user.save();
    return { usedSeconds: limitSeconds, limitSeconds, active: false, limitReached: true };
  }
  return { usedSeconds, limitSeconds, active: true, limitReached: false };
};

const stopAISession = async (userId, sessionId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  if (user.aiUsage?.activeSessionId === sessionId) {
    await syncActiveUsage(user);
    user.aiUsage.activeSince = null;
    user.aiUsage.activeSessionId = '';
    await user.save();
  }
  const effectivePlan = process.env.DEV_PLAN_BYPASS === 'true' ? 'Advance' : (user.plan || 'Basic');
  const limitSeconds = LIMITS[effectivePlan];
  return { usedSeconds: Number(user.aiUsage?.secondsUsed || 0), limitSeconds };
};

// Kept for compatibility with existing AI endpoints. It now records the real elapsed
// request duration instead of charging a fixed one-minute block.
const recordAIRequestDuration = async (userId, startedAt) => {
  const elapsedSeconds = Math.max(1, Math.ceil((Date.now() - startedAt) / 1000));
  const user = await User.findById(userId);
  if (!user) return;
  await syncActiveUsage(user);
  user.aiUsage.secondsUsed = Number(user.aiUsage.secondsUsed || 0) + elapsedSeconds;
  user.aiUsage.minutesUsed = user.aiUsage.secondsUsed / 60;
  await user.save();
};

const consumeAIMinute = async (userId) => recordAIRequestDuration(userId, Date.now() - 1000);

module.exports = {
  aiUsageGuard,
  startAISession,
  heartbeatAISession,
  stopAISession,
  recordAIRequestDuration,
  consumeAIMinute,
  syncActiveUsage,
  LIMITS,
};
