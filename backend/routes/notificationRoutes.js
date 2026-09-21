const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();


// Get logged-in user's notifications
router.get(
  "/",
  authMiddleware,
  getNotifications
);


// Mark one as read
router.patch(
  "/:id/read",
  authMiddleware,
  markAsRead
);


// Mark all as read
router.patch(
  "/read-all",
  authMiddleware,
  markAllAsRead
);


// Delete one notification
router.delete(
  "/:id",
  authMiddleware,
  deleteNotification
);


module.exports = router;