const Notification = require('../models/Notification');

const createNotification = async ({ recipient, type, title, message, relatedId }) => {
  try {
    await Notification.create({ recipient, type, title, message, relatedId });
  } catch (err) {
    console.error("Notification Error:", err);
  }
};

module.exports = { createNotification };
