const { generateAIResponse } = require("../services/aiService");
const User = require("../models/User");

/**
 * Middleware to check for inappropriate content.
 * Uses AI to determine if the input is offensive, unrelated, or harmful.
 */
const contentGuard = async (req, res, next) => {
  const input = req.body.message || req.body.prompt || req.body.word;
  if (!input) return next();

  try {
    const guardPrompt = `
      Analyze the following user input for a language learning app:
      Input: "${input}"
      
      Is this input:
      1. Inappropriate, offensive, or harmful?
      2. Completely unrelated to language learning, English practice, or general conversation?
      
      Return ONLY valid JSON:
      {
        "isInappropriate": boolean,
        "reason": "string (explain why)"
      }
    `;

    const result = await generateAIResponse(guardPrompt);
    const { isInappropriate, reason } = JSON.parse(result);

    if (isInappropriate) {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      // Warning Logic: Warning 1 -> Warning 2 -> Restriction
      user.warnings.count = (user.warnings.count || 0) + 1;
      user.warnings.lastWarningDate = new Date();
      await user.save();

      if (user.warnings.count === 1) {
        return res.status(400).json({ 
          success: false, 
          message: `⚠️ Warning 1: Your input was found to be inappropriate. Please keep the conversation respectful. Reason: ${reason}` 
        });
      } else if (user.warnings.count === 2) {
        return res.status(400).json({ 
          success: false, 
          message: `⚠️ Warning 2: This is your second warning. Continued misuse will lead to temporary restriction. Reason: ${reason}` 
        });
      } else {
        // Restriction
        user.warnings.isRestricted = true;
        await user.save();
        return res.status(403).json({ 
          success: false, 
          message: `🚫 Feature Restricted: You have received multiple warnings for inappropriate content. Access to this feature is temporarily hidden. Reason: ${reason}` 
        });
      }
    }
    next();
  } catch (error) {
    console.error("Content Guard Error:", error);
    // In case of AI failure, we let the message through but log it.
    next();
  }
};

module.exports = {
  contentGuard,
};
