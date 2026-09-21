const crypto = require('crypto');
const Friendship = require('../models/Friendship');

// In-memory WebRTC signaling. Every room is private to the invited student.
const rooms = new Map();
const makeId = () => crypto.randomBytes(8).toString('hex');
const getRoom = (roomId) => rooms.get(roomId);

const areFriends = async (userA, userB) => {
  if (!userB) return false;
  const friendship = await Friendship.findOne({
    $or: [
      { requester: userA, recipient: userB },
      { requester: userB, recipient: userA },
    ],
    status: 'accepted',
  });
  return Boolean(friendship);
};

const joinRoom = async (req, res) => {
  try {
    const roomId = String(req.body.roomId || '').trim().toUpperCase();
    const invitedUserId = String(req.body.invitedUserId || '').trim();
    if (!roomId) return res.status(400).json({ success: false, message: 'Room code is required' });

    let room = getRoom(roomId);
    if (!room) {
      if (!invitedUserId || invitedUserId === req.user.userId) {
        return res.status(403).json({ success: false, message: 'Create this call from Community by selecting a friend.' });
      }
      if (!(await areFriends(req.user.userId, invitedUserId))) {
        return res.status(403).json({ success: false, message: 'You can only create a video call with an accepted friend.' });
      }
      room = { ownerId: req.user.userId, invitedUserId, peers: new Map(), signals: [] };
      rooms.set(roomId, room);
    } else {
      const allowed = req.user.userId === room.ownerId || req.user.userId === room.invitedUserId;
      if (!allowed) return res.status(403).json({ success: false, message: 'This is a private friend invitation.' });
    }

    if (room.peers.size >= 2 && !room.peers.has(req.user.userId)) {
      return res.status(409).json({ success: false, message: 'This room already has two learners.' });
    }
    const existingUserPeer = [...room.peers.entries()].find(([, peer]) => peer.userId === req.user.userId);
    if (existingUserPeer) {
      return res.json({ success: true, roomId, peerId: existingUserPeer[0], existingPeerId: [...room.peers.keys()].find((id) => id !== existingUserPeer[0]) || null, count: room.peers.size, invitedUserId: room.invitedUserId });
    }

    const peerId = makeId();
    room.peers.set(peerId, { userId: req.user.userId, joinedAt: Date.now() });
    const existingPeerId = [...room.peers.keys()].find((id) => id !== peerId) || null;
    res.json({ success: true, roomId, peerId, existingPeerId, count: room.peers.size, invitedUserId: room.invitedUserId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to join private video room' });
  }
};

const getAuthorizedRoom = (req, roomId) => {
  const room = getRoom(roomId);
  if (!room) return null;
  const peer = room.peers.get(req.userPeerId || req.body?.from || req.query?.peerId);
  return { room, peer };
};

const signal = (req, res) => {
  const { roomId, from, to, type, data } = req.body;
  const room = getRoom(String(roomId || '').toUpperCase());
  if (!room || !room.peers.has(from) || !room.peers.has(to)) return res.status(404).json({ success: false, message: 'Room peer not found' });
  const sender = room.peers.get(from);
  if (!sender || sender.userId !== req.user.userId) return res.status(403).json({ success: false, message: 'Unauthorized room peer' });
  room.signals.push({ id: makeId(), to, from, type, data, createdAt: Date.now() });
  room.signals = room.signals.slice(-100);
  res.json({ success: true });
};

const getSignals = (req, res) => {
  const room = getRoom(String(req.query.roomId || '').toUpperCase());
  const peerId = String(req.query.peerId || '');
  if (!room || !room.peers.has(peerId) || room.peers.get(peerId).userId !== req.user.userId) return res.status(403).json({ success: false, message: 'Unauthorized room peer' });
  const since = Number(req.query.since || 0);
  const signals = room.signals.filter((item) => item.to === peerId && item.createdAt > since);
  res.json({ success: true, signals });
};

const leaveRoom = (req, res) => {
  const roomId = String(req.body.roomId || '').toUpperCase();
  const room = getRoom(roomId);
  if (room) {
    const peer = room.peers.get(req.body.peerId);
    if (peer && peer.userId === req.user.userId) {
      room.peers.delete(req.body.peerId);
      room.signals = room.signals.filter((item) => item.from !== req.body.peerId && item.to !== req.body.peerId);
    }
    if (!room.peers.size) rooms.delete(roomId);
  }
  res.json({ success: true });
};

module.exports = { joinRoom, signal, getSignals, leaveRoom };
