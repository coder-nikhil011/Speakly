const mongoose = require("mongoose");
const Notification = require("../models/Notification");


// ========================================
// GET USER NOTIFICATIONS
// ========================================

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      notifications,
    });

  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch notifications",
    });
  }
};


// ========================================
// MARK ONE NOTIFICATION AS READ
// ========================================

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: id,
          userId: req.user.userId,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });

  } catch (error) {
    console.error("Mark notification error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update notification",
    });
  }
};


// ========================================
// MARK ALL NOTIFICATIONS AS READ
// ========================================

const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        userId: req.user.userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: result.modifiedCount,
    });

  } catch (error) {
    console.error(
      "Mark all notifications error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to update notifications",
    });
  }
};


// ========================================
// DELETE ONE NOTIFICATION
// ========================================

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification =
      await Notification.findOneAndDelete({
        _id: id,
        userId: req.user.userId,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete notification error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete notification",
    });
  }
};


module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};