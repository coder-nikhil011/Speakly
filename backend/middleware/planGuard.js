const User = require('../models/User');

const hierarchy = { Basic: 0, Premium: 1, Advance: 2 };

const requirePlan = (minimumPlan) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('plan');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (process.env.DEV_PLAN_BYPASS !== 'true' && hierarchy[user.plan || 'Basic'] < hierarchy[minimumPlan]) {
      return res.status(403).json({
        success: false,
        code: 'PLAN_REQUIRED',
        requiredPlan: minimumPlan,
        message: `${minimumPlan} plan is required for this feature.`,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to verify plan access' });
  }
};

module.exports = { requirePlan, hierarchy };
