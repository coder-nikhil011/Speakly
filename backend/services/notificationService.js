const Notification =
  require("../models/Notification");


// ============================================
// CREATE
// ============================================

const createNotification = async ({
  userId,
  title,
  message,
  type = "system",
}) => {
  return await Notification.create({
    userId,
    title,
    message,
    type,
  });
};


// ============================================
// GET USER NOTIFICATIONS
// ============================================

const getUserNotifications =
  async (userId) => {
    return await Notification.find({
      userId,
    }).sort({
      createdAt: -1,
    });
  };


// ============================================
// UNREAD COUNT
// ============================================

const getUnreadCount =
  async (userId) => {
    return await Notification.countDocuments({
      userId,
      isRead: false,
    });
  };


// ============================================
// MARK ONE READ
// ============================================

const markAsRead = async (
  notificationId,
  userId
) => {
  return await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
    }
  );
};


// ============================================
// MARK ALL READ
// ============================================

const markAllAsRead =
  async (userId) => {
    return await Notification.updateMany(
      {
        userId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );
  };


// ============================================
// DELETE
// ============================================

const deleteNotification =
  async (
    notificationId,
    userId
  ) => {
    return await Notification.findOneAndDelete({
      _id: notificationId,
      userId,
    });
  };


module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};