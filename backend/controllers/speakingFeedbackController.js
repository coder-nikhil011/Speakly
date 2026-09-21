
const { analyzePronunciation } = require("../services/speakingFeedbackService");

const analyzeSpeech = async (req, res) => {
  try {
    const { targetText, spokenText } = req.body;

    if (!targetText || !spokenText) {
      return res.status(400).json({ 
        success: false, 
        message: "Both targetText and spokenText are required" 
      });
    }

    const analysis = await analyzePronunciation({ targetText, spokenText });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error analyzing speech", 
      error: error.message 
    });
  }
};

module.exports = {
  analyzeSpeech,
};
