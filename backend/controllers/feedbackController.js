const LearningFeedback =
  require("../models/LearningFeedback");

const LearningProgress =
  require("../models/LearningProgress");


// ========================================
// SUBMIT LEARNING FEEDBACK
// ========================================

const submitFeedback = async (
  req,
  res
) => {
  try {

    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }

    const {
      wordId,
      sentenceId,
      type,
      message,
    } = req.body;


    if (!wordId || !type) {
      return res.status(400).json({
        success: false,
        message:
          "wordId and feedback type are required",
      });
    }


    const feedback =
      await LearningFeedback.create({
        userId: req.user.userId,
        wordId,
        sentenceId:
          sentenceId || null,
        type,
        message:
          message || "",
      });


    // If student struggles,
    // schedule earlier revision.

    if (
      type === "not_understood" ||
      type === "too_difficult"
    ) {

      await LearningProgress.findOneAndUpdate(
        {
          userId: req.user.userId,
          wordId,
        },
        {
          $set: {
            nextRevisionAt:
              new Date(
                Date.now() +
                  24 *
                    60 *
                    60 *
                    1000
              ),
          },
          $inc: {
            practiceCount: 1,
          },
        },
        {
          upsert: true,
        }
      );
    }


    res.status(201).json({
      success: true,
      message:
        "Feedback recorded successfully",
      feedback,
    });

  } catch (error) {

    console.error(
      "Feedback error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to save feedback",
    });
  }
};


module.exports = {
  submitFeedback,
};