const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/contentLearningController');
const router = express.Router();
router.get('/today', authMiddleware, controller.getTodayClass);
router.post('/progress', authMiddleware, controller.saveContent);
router.get('/history', authMiddleware, controller.history);
module.exports = router;
