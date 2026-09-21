const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { 
  searchUsers, 
  sendFriendRequest, 
  handleFriendRequest, 
  getFriendsList, 
  getPendingRequests 
} = require("../controllers/socialController");

const router = express.Router();

router.get("/search", authMiddleware, searchUsers);
router.post("/request", authMiddleware, sendFriendRequest);
router.post("/handle-request", authMiddleware, handleFriendRequest);
router.get("/friends", authMiddleware, getFriendsList);
router.get("/pending", authMiddleware, getPendingRequests);

module.exports = router;
