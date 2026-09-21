const SpeakingSession =
  require("../models/SpeakingSession");

const SpeakingMessage =
  require("../models/SpeakingMessage");

const {
  generateAIResponse,
} = require("../services/speakingAIService");

const { autoSyncWords } = require("../services/wordSyncService");


// ==========================================
// START SESSION
// ==========================================

const startSession = async (
  req,
  res
) => {
  try {
    const {
      friendName,
      voice,
      personality,
      level,
      topic,
      story,
      preferredLanguage,
      mode = "chat",
    } = req.body;

    const User = require("../models/User");
    const user = await User.findById(req.user.userId).select("plan");
    if (mode === "video" && process.env.DEV_PLAN_BYPASS !== "true" && !["Premium", "Advance"].includes(user?.plan || "Basic")) {
      return res.status(403).json({ success: false, code: "PLAN_REQUIRED", message: "AI Video Call is available on Premium and Advance. Basic can use AI Chat." });
    }

    const session =
      await SpeakingSession.create({
        userId: req.user.userId,

        friendName:
          friendName || "Alex",

        voice:
          voice || "female",

        personality:
          personality || "friendly",

        level:
          level || "intermediate",

        topic:
          topic ||
          "General Conversation",
        story: story || "",
        preferredLanguage: preferredLanguage || "auto",
        mode,

        status: "active",
      });

    await autoSyncWords(`${session.topic} ${session.story}`, "user-story", session.level);

    const welcomeMessage =
      `Hi! I'm ${
        session.friendName
      }. Let's practice English together. ` +
      `Our topic is ${session.topic}. ` +
      `Tell me something about it.`;

    await SpeakingMessage.create({
      sessionId: session._id,

      userId: req.user.userId,

      role: "assistant",

      content: welcomeMessage,
    });

    session.totalMessages = 1;

    await session.save();

    res.status(201).json({
      success: true,

      session: {
        id: session._id,
        friendName:
          session.friendName,
        voice: session.voice,
        personality:
          session.personality,
        level: session.level,
        topic: session.topic,
        status: session.status,
      },

      message: welcomeMessage,
    });
  } catch (error) {
    console.error(
      "Start speaking session:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// SEND MESSAGE
// ==========================================

const sendMessage = async (
  req,
  res
) => {
  try {
    const {
      sessionId,
      message,
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message:
          "sessionId is required",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Message is required",
      });
    }

    const session =
      await SpeakingSession.findOne({
        _id: sessionId,
        userId: req.user.userId,
        status: "active",
      });

    if (!session) {
      return res.status(404).json({
        success: false,
        message:
          "Active speaking session not found",
      });
    }

    // Capture vocabulary from the student's own story and messages.
    await autoSyncWords(message.trim(), "user-story", session.level);

    // Save user's message
    await SpeakingMessage.create({
      sessionId,
      userId: req.user.userId,
      role: "user",
      content: message.trim(),
    });

    // Get conversation history
    const history =
      await SpeakingMessage.find({
        sessionId,
      })
        .sort({
          createdAt: 1,
        })
        .select(
          "role content"
        );

    const aiResponse =
      await generateAIResponse({
        messages: history,
        level: session.level,
        friendName:
          session.friendName,
        personality:
          session.personality,
        topic: session.topic,
        preferredLanguage: session.preferredLanguage,
        story: session.story,
      });

    // Save AI response
    const assistantMessage =
      await SpeakingMessage.create({
        sessionId,
        userId: req.user.userId,
        role: "assistant",
        content:
          aiResponse.reply,

        correction:
          aiResponse.correction || {},

        newWords:
          aiResponse.newWords || [],
      });

    // AUTO-SYNC: Capture new words from the AI's reply to grow the Word Bank
    await autoSyncWords(aiResponse.reply, "ai", session.level);

    session.totalMessages += 2;

    await session.save();

    res.json({
      success: true,

      userMessage: {
        content: message.trim(),
      },

      assistantMessage: {
        id:
          assistantMessage._id,
        content:
          aiResponse.reply,
        correction:
          aiResponse.correction,
        newWords:
          aiResponse.newWords,
      },
    });
  } catch (error) {
    console.error(
      "Speaking message:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// GET SESSION HISTORY
// ==========================================

const getSessionMessages =
  async (req, res) => {
    try {
      const session =
        await SpeakingSession.findOne({
          _id: req.params.sessionId,
          userId: req.user.userId,
        });

      if (!session) {
        return res.status(404).json({
          success: false,
          message:
            "Speaking session not found",
        });
      }

      const messages =
        await SpeakingMessage.find({
          sessionId:
            req.params.sessionId,
        }).sort({
          createdAt: 1,
        });

      res.json({
        success: true,
        session,
        messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };


// ==========================================
// GET ALL SPEAKING HISTORY
// ==========================================

const getSpeakingHistory =
  async (req, res) => {
    try {
      const sessions =
        await SpeakingSession.find({
          userId:
            req.user.userId,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        sessions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };


// ==========================================
// END SESSION
// ==========================================

const endSession = async (
  req,
  res
) => {
  try {
    const session =
      await SpeakingSession.findOne({
        _id: req.params.sessionId,
        userId: req.user.userId,
        status: "active",
      });

    if (!session) {
      return res.status(404).json({
        success: false,
        message:
          "Active session not found",
      });
    }

    session.status =
      "completed";

    session.endedAt =
      new Date();

    await session.save();

    res.json({
      success: true,

      message:
        "Speaking session completed",

      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  startSession,
  sendMessage,
  getSessionMessages,
  getSpeakingHistory,
  endSession,
};