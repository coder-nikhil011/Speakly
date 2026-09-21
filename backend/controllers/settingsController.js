const User = require('../models/User');

exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('settings');
    res.json(user.settings || { notifications: true, reminders: true, preferences: 'Default' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { notifications, reminders, preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { settings: { notifications, reminders, preferences } } },
      { new: true }
    ).select('settings');
    res.json(user.settings);
  } catch (error) {
    res.status(400).json({ message: 'Error updating settings', error });
  }
};
