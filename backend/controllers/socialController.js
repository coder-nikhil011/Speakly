const Friendship = require("../models/Friendship");
const User = require("../models/User");

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: "Search query is required" });

    const users = await User.find({
      $and: [
        { role: "student" },
        { 
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } }
          ] 
        },
        { _id: { $ne: req.user.userId } }
      ]
    }).select("name email profileImage");

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error searching users" });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    if (recipientId === req.user.userId) return res.status(400).json({ success: false, message: "You cannot add yourself" });

    const existing = await Friendship.findOne({
      $or: [
        { requester: req.user.userId, recipient: recipientId },
        { requester: recipientId, recipient: req.user.userId }
      ]
    });

    if (existing) return res.status(400).json({ success: false, message: "Friend request already exists or you are already friends" });

    await Friendship.create({ requester: req.user.userId, recipient: recipientId });
    res.json({ success: true, message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending request" });
  }
};

const handleFriendRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body; // status: "accepted" or "rejected"
    const request = await Friendship.findById(requestId);

    if (!request || request.recipient.toString() !== req.user.userId) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = status;
    request.updatedAt = Date.now();
    await request.save();

    res.json({ success: true, message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error handling request" });
  }
};

const getFriendsList = async (req, res) => {
  try {
    const friendships = await Friendship.find({
      $or: [{ requester: req.user.userId }, { recipient: req.user.userId }],
      status: "accepted"
    }).populate("requester recipient", "name email profileImage");

    const friends = friendships.map(f => 
      f.requester.toString() === req.user.userId ? f.recipient : f.requester
    );

    res.json({ success: true, friends });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching friends" });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const requests = await Friendship.find({ recipient: req.user.userId, status: "pending" })
      .populate("requester", "name email profileImage");
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching requests" });
  }
};

module.exports = {
  searchUsers,
  sendFriendRequest,
  handleFriendRequest,
  getFriendsList,
  getPendingRequests,
};
