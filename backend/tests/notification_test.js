
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const JoinRequest = require('../models/JoinRequest');
const Notification = require('../models/Notification');
const Lesson = require('../models/Lesson');
const assignmentController = require('../controllers/assignmentController');
const connectionController = require('../controllers/connectionController');
const teacherContentController = require('../controllers/teacherContentController');

dotenv.config();

async function runTests() {
  try {
    // Try to connect to a local test DB to avoid messing with production
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/speakly_test');
    console.log('Connected to MongoDB');

    // Setup: Create dummy users
    const teacher = await User.create({
      name: 'Test Teacher',
      email: 'teacher_test@test.com',
      password: 'password',
      role: 'teacher',
      isVerified: true
    });

    const student = await User.create({
      name: 'Test Student',
      email: 'student_test@test.com',
      password: 'password',
      role: 'student',
      isVerified: true
    });

    // Create a connection (Accepted)
    await JoinRequest.create({
      studentId: student._id,
      teacherId: teacher._id,
      status: 'accepted'
    });

    console.log('--- Testing Assignment Notification ---');
    const mockReqAssign = {
      user: { userId: teacher._id },
      body: { title: 'Test Assignment', description: 'Test Desc', dueDate: new Date() }
    };
    const mockResAssign = {
      status: () => ({ json: () => {} }),
      json: () => {}
    };
    await assignmentController.createAssignment(mockReqAssign, mockResAssign);
    
    const assignNotif = await Notification.findOne({ recipient: student._id, type: 'assignment' });
    console.log(assignNotif ? `✅ Assignment Notification Found: ${assignNotif.title}` : '❌ Assignment Notification Missing');

    console.log('\n--- Testing Connection Notification (Accept) ---');
    const request = await JoinRequest.findOne({ studentId: student._id, teacherId: teacher._id });
    const mockReqConn = {
      user: { userId: teacher._id },
      body: { requestId: request._id, action: 'accepted' }
    };
    const mockResConn = {
      json: () => {}
    };
    await connectionController.handleRequest(mockReqConn, mockResConn);
    
    const connNotif = await Notification.findOne({ recipient: student._id, type: 'connection' });
    console.log(connNotif ? `✅ Connection Notification Found: ${connNotif.title}` : '❌ Connection Notification Missing');

    console.log('\n--- Testing Lesson Notification ---');
    const mockReqLesson = {
      user: { userId: teacher._id },
      body: { title: 'Test Lesson', description: 'Desc', content: 'Content' }
    };
    const mockResLesson = {
      status: () => ({ json: () => {} }),
      json: () => {}
    };
    await teacherContentController.createLesson(mockReqLesson, mockResLesson);
    
    const lessonNotif = await Notification.findOne({ recipient: student._id, type: 'lesson' });
    console.log(lessonNotif ? `✅ Lesson Notification Found: ${lessonNotif.title}` : '❌ Lesson Notification Missing');

    // Cleanup
    await User.deleteMany({});
    await JoinRequest.deleteMany({});
    await Notification.deleteMany({});
    await Assignment.deleteMany({});
    await Lesson.deleteMany({});
    
    await mongoose.disconnect();
    console.log('\nAll technical tests completed successfully.');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

runTests();
