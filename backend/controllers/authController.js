const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const TeacherProfile = require("../models/TeacherProfile");


// =========================
// SIGNUP
// =========================

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Role validation
    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: true, // Auto-verify for testing
      verificationToken: Math.random().toString(36).substring(2, 15),
    });



    // Create role-specific profile (Fail-safe)
    try {
      if (role === "student") {
        await StudentProfile.create({ userId: user._id });
      } else if (role === "teacher") {
        await TeacherProfile.create({ userId: user._id });
      }
    } catch (profileErr) {
      console.error("⚠️ Profile creation failed, but allowing login:", profileErr.message);
    }

    // JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
  console.error("========== SIGNUP ERROR ==========");
  console.error(error);
  console.error("=================================");

  res.status(500).json({
    success: false,
    message: "Server error",
    error: error.message,
  });
 }
};


// =========================
// LOGIN
// =========================

const login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email,
    }).lean(); // Use lean() for faster read-only query

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =========================
// OAUTH CALLBACKS
// =========================

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const googleAuthCallback = (req, res) => {
  const user = req.user;
  const token = generateToken(user);
  // Redirect back to frontend with token in query string
  res.redirect(`http://localhost:5173/login?token=${token}`);
};

const microsoftAuthCallback = (req, res) => {
  const user = req.user;
  const token = generateToken(user);
  // Redirect back to frontend with token in query string
  res.redirect(`http://localhost:5173/login?token=${token}`);
};

// =========================
// FORGOT PASSWORD
// =========================

const forgotPassword = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const user = await User.findOne({ email, name });
    if (!user) {
      return res.status(404).json({ success: false, message: "No user found with this name and email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to user
    user.verificationToken = otp; 
    await user.save();

    // Mock Email Sending (Log to console for dev)
    console.log(`--- EMAIL SENT ---`);
    console.log(`To: ${email}`);
    console.log(`Your OTP is: ${otp}`);
    console.log(`-------------------`);

    res.json({
      success: true,
      message: "OTP sent to your email successfully",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;

    if (!userId || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verificationToken !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.verificationToken = undefined; // Clear OTP
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  signup,
  login,
  googleAuthCallback,
  microsoftAuthCallback,
  forgotPassword,
  resetPassword,
};