const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const TeacherProfile = require('../models/TeacherProfile');

const seedDummyUsers = async () => {
  try {
    const dummyUsers = [
      {
        name: 'Test Student',
        email: 'unikhil723@gmail.com',
        password: '1111',
        role: 'student',
      },
      {
        name: 'Test Teacher',
        email: 'unikhil7668@gmail.com',
        password: '1111',
        role: 'teacher',
      },
    ];

    for (const userData of dummyUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        console.log(`Seeding user: ${userData.email}`);
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create({
          ...userData,
          password: hashedPassword,
          isVerified: true,
        });

        if (userData.role === 'student') {
          await StudentProfile.create({ userId: user._id });
        } else if (userData.role === 'teacher') {
          await TeacherProfile.create({ userId: user._id });
        }
      }
    }
    console.log('Dummy users seeding check complete.');
  } catch (error) {
    console.error('Error seeding dummy users:', error);
  }
};

module.exports = { seedDummyUsers };
