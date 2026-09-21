const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createPersonalChallenge, getChallenges, completeChallenge } = require('../controllers/challengeController');
const router = express.Router();
router.get('/', authMiddleware, getChallenges);
router.post('/:type', authMiddleware, createPersonalChallenge);
router.patch('/:id/complete', authMiddleware, completeChallenge);
module.exports = router;
