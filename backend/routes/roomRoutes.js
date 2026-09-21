const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/roomController');
const router = express.Router();
router.post('/join', authMiddleware, controller.joinRoom);
router.post('/signal', authMiddleware, controller.signal);
router.get('/signals', authMiddleware, controller.getSignals);
router.post('/leave', authMiddleware, controller.leaveRoom);
module.exports = router;
