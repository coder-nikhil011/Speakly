const Word = require("../models/Word");
const Sentence = require("../models/Sentence");
const LearningProgress = require("../models/LearningProgress");

const {
  generateLearningSentence,
} = require("../services/aiService");


// ========================================
// GENERATE NEW SENTENCE
// ========================================

const generateSentence = async (req, res) => {
  try {

    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }

    const { wordId } = req.body;

    if (!wordId) {
      return res.status(400).json({
        success: false,
        message: "wordId is required",
      });
    }


    // ------------------------------------
    // Target word
    // ------------------------------------

    const word = await Word.findById(wordId);

    if (!word) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }


    // ------------------------------------
    // Student progress
    // ------------------------------------

    const progress =
      await LearningProgress.find({
        userId: req.user.userId,
      })
        .populate("wordId")
        .sort({
          updatedAt: -1,
        })
        .limit(15);


    const previousWords = progress
      .filter((item) => item.wordId)
      .map((item) => item.wordId.word)
      .filter(
        (value) =>
          value.toLowerCase() !==
          word.word.toLowerCase()
      );


    // ------------------------------------
    // Previous sentences
    // ------------------------------------

    const previousSentences =
      await Sentence.find({
        wordId: {
          $in: progress
            .filter((item) => item.wordId)
            .map((item) => item.wordId._id),
        },
      })
        .limit(20)
        .select("sentence");


    const sentenceList =
      previousSentences.map(
        (item) => item.sentence
      );


    // ------------------------------------
    // Generate with AI
    // ------------------------------------

    const generated =
      await generateLearningSentence({
        targetWord: word.word,
        targetMeaning: word.meaning,
        studentLevel: word.level,
        previousWords,
        previousSentences:
          sentenceList,
      });


    // ------------------------------------
    // Save sentence
    // ------------------------------------

    const sentence =
      await Sentence.create({
        wordId: word._id,

        sentence:
          generated.sentence,

        difficulty:
          word.level,

        context:
          generated.context || "",

        hindiHint:
          generated.hindiHint || "",
      });


    await awardXP(req.user.userId, 20, "Generated a new learning sentence");
    await updateStreak(req.user.userId);

    res.status(201).json({
      success: true,

      sentence: {
        id: sentence._id,
        sentence: sentence.sentence,
        context: sentence.context,
        hindiHint: sentence.hindiHint,
      },
    });

  } catch (error) {

    console.error(
      "AI sentence generation error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to generate learning sentence",
    });
  }
};


module.exports = {
  generateSentence,
};