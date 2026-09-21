const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { startAISession, heartbeatAISession, stopAISession, LIMITS, syncActiveUsage } = require('../middleware/aiUsageGuard');
const User = require('../models/User');

const router = express.Router();

router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('plan aiUsage');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await syncActiveUsage(user);
    const effectivePlan = process.env.DEV_PLAN_BYPASS === 'true' ? 'Advance' : (user.plan || 'Basic');
    const limitSeconds = LIMITS[effectivePlan];
    const usedSeconds = Math.min(Number(user.aiUsage?.secondsUsed || 0), limitSeconds);
    res.json({ success: true, plan: effectivePlan, usedSeconds, limitSeconds, remainingSeconds: Math.max(0, limitSeconds - usedSeconds), active: Boolean(user.aiUsage?.activeSessionId) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to read AI usage' });
  }
});

router.post('/start', authMiddleware, async (req, res) => {
  try {
    const data = await startAISession(req.user.userId);
    res.status(201).json({ success: true, ...data });
  } catch (error) {
    if (error.code === 'AI_DAILY_LIMIT') return res.status(429).json({ success: false, code: error.code, message: 'Daily AI time limit reached.' });
    res.status(500).json({ success: false, message: 'Unable to start AI usage timer' });
  }
});

router.post('/heartbeat', authMiddleware, async (req, res) => {
  try {
    const data = await heartbeatAISession(req.user.userId, req.body.sessionId);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to update AI usage timer' });
  }
});

router.post('/stop', authMiddleware, async (req, res) => {
  try {
    const data = await stopAISession(req.user.userId, req.body.sessionId);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to stop AI usage timer' });
  }
});

module.exports = router;
