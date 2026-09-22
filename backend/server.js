const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("./config/passport");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { Configuration, OpenAIApi } = require("openai");
const feedbackRoutes = require("./routes/feedbackRoutes");
const learningRoutes = require("./routes/learningRoutes");
const revisionRoutes = require("./routes/revisionRoutes");
const speakingRoutes = require("./routes/speakingRoutes");
const storyRoutes = require("./routes/storyRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const teacherContentRoutes = require("./routes/teacherContentRoutes");
const textLearningRoutes = require("./routes/textLearningRoutes");
const aiTutorRoutes = require("./routes/aiTutorRoutes");
const weeklyTestRoutes = require("./routes/weeklyTestRoutes");
const reportRoutes = require("./routes/reportRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const teacherAssistantRoutes = require("./routes/teacherAssistantRoutes");
const socialRoutes = require("./routes/socialRoutes");
const contentRoutes = require("./routes/contentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const contentLearningRoutes = require("./routes/contentLearningRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const roomRoutes = require("./routes/roomRoutes");
const aiUsageRoutes = require("./routes/aiUsageRoutes");
const { seedWordList } = require("./services/wordSeedService");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB().then(() => seedWordList()).catch((error) => console.error("Word library sync failed:", error.message));

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.JWT_SECRET || "speakly_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/revision", revisionRoutes);
app.use("/api/speaking", speakingRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/teacher-content", teacherContentRoutes);
app.use("/api/text-learning", textLearningRoutes);
app.use("/api/ai-tutor", aiTutorRoutes);
app.use("/api/weekly-test", weeklyTestRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/connection", connectionRoutes);
app.use("/api/teacher-assistant", teacherAssistantRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/learning-content", contentLearningRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/ai-usage", aiUsageRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Speakly API is running",
  });
});

const PORT = process.env.PORT || 5001;

console.log("DEBUG: GOOGLE_CLIENT_ID is:", process.env.GOOGLE_CLIENT_ID ? "LOADED" : "MISSING");
console.log("DEBUG: GOOGLE_CLIENT_SECRET is:", process.env.GOOGLE_CLIENT_SECRET ? "LOADED" : "MISSING");

app.listen(PORT, () => {
  console.log(`Speakly server running on port ${PORT}`);
});