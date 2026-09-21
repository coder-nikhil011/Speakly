const express = require('express');
const router = express.Router();
const { getAssignments, createAssignment, getAssignmentById, getStudentAssignments } = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const { requirePlan } = require('../middleware/planGuard');

router.get('/', authMiddleware, getAssignments);
router.get('/student', authMiddleware, requirePlan('Premium'), getStudentAssignments);
router.post('/', authMiddleware, createAssignment);
router.get('/:id', authMiddleware, getAssignmentById);
module.exports = router;
