const Word = require("../models/Word");
const Sentence = require("../models/Sentence");
const LearningProgress = require("../models/LearningProgress");
const Lesson = require("../models/Lesson");
const { autoSyncWords } = require("../services/wordSyncService");


// ========================================
// CHECK TEACHER
// ========================================

const checkTeacher = (req, res) => {
  if (req.user.role !== "teacher") {
    res.status(403).json({
      success: false,
      message: "Teacher access only",
    });

    return false;
  }

  return true;
};


// ========================================
// LESSON MANAGEMENT
// ========================================

const createLesson = async (req, res) => {
  try {
    if (!checkTeacher(req, res)) return;

    const { title, description, content, materials, vocabulary } = req.body;
    const teacherId = req.user.userId;

    const lesson = await Lesson.create({
      teacherId,
      title,
      description,
      content,
      materials,
      vocabulary,
    });

    if (vocabulary && vocabulary.length > 0) {
      for (const item of vocabulary) {
        await Word.findOneAndUpdate(
          { word: item.word.toLowerCase() },
          { 
            meaning: item.meaning, 
            source: "teacher",
            $setOnInsert: { level: "intermediate" }
          },
          { upsert: true }
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });

  } catch (error) {
    console.error("Create lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create lesson",
    });
  }
};

const getTeacherLessons = async (req, res) => {
  try {
    if (!checkTeacher(req, res)) return;
    const lessons = await Lesson.find({ teacherId: req.user.userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch lessons",
    });
  }
};

const updateLesson = async (req, res) => {
  try {
    if (!checkTeacher(req, res)) return;
    const { id } = req.params;
    const lesson = await Lesson.findOneAndUpdate(
      { _id: id, teacherId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to update lesson" });
  }
};

const deleteLesson = async (req, res) => {
  try {
    if (!checkTeacher(req, res)) return;
    const { id } = req.params;
    await Lesson.findOneAndDelete({ _id: id, teacherId: req.user.userId });
    res.json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to delete lesson" });
  }
};

const getMyTeacherLessons = async (req, res) => {
  try {
    const JoinRequest = require("../models/JoinRequest");
    const connection = await JoinRequest.findOne({ studentId: req.user.userId, status: "accepted" });
    if (!connection) {
      return res.status(404).json({ success: false, message: "You are not connected to any teacher." });
    }
    const lessons = await Lesson.find({ teacherId: connection.teacherId }).sort({ createdAt: -1 });
    res.json({ success: true, lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch teacher lessons" });
  }
};



// ========================================
// CREATE WORD
// ========================================

const createWord = async (req, res) => {
  try {
    if (!checkTeacher(req, res)) return;

    const {
      word,
      level,
      partOfSpeech,
      meaning,
      hindiHint,
      category,
    } = req.body;

    if (
      !word ||
      !level ||
      !meaning
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Word, level and meaning are required",
      });
    }

    const existingWord =
      await Word.findOne({
        word: word.toLowerCase().trim(),
      });

    if (existingWord) {
      return res.status(409).json({
        success: false,
        message: "Word already exists",
      });
    }

    const newWord = await Word.create({
      word: word.toLowerCase().trim(),
      level,
      partOfSpeech:
        partOfSpeech || "",
      meaning,
      hindiHint:
        hindiHint || "",
      category:
        category || "",
    });

    res.status(201).json({
      success: true,
      message: "Word created successfully",
      word: newWord,
    });

  } catch (error) {
    console.error(
      "Create word error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to create word",
    });
  }
};


// ========================================
// ADD SENTENCE TO WORD
// ========================================

const createSentence = async (req, res) => {
  try {
    if (!checkTeacher(req, res)) return;

    const { wordId } = req.params;

    const {
      sentence,
      difficulty,
      context,
      hindiHint,
    } = req.body;

    if (!sentence) {
      return res.status(400).json({
        success: false,
        message: "Sentence is required",
      });
    }

    const word =
      await Word.findById(wordId);

    if (!word) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    const newSentence =
      await Sentence.create({
        wordId,
        sentence,
        difficulty:
          difficulty || word.level,
        context:
          context || "",
        hindiHint:
          hindiHint || "",
      });

    // AUTO-SYNC: Capture any new words used in the sentence
    await autoSyncWords(sentence, "teacher", word.level);

    res.status(201).json({
      success: true,
      message:
        "Sentence added successfully",
      sentence: newSentence,
    });

  } catch (error) {
    console.error(
      "Create sentence error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to create sentence",
    });
  }
};


// ========================================
// GET TEACHER WORDS
// ========================================

const getTeacherWords = async (
  req,
  res
) => {
  try {
    if (!checkTeacher(req, res)) return;

    const words = await Word.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      words,
    });

  } catch (error) {
    console.error(
      "Get teacher words error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch words",
    });
  }
};


// ========================================
// GET WORD WITH SENTENCES
// ========================================

const getWordDetails = async (
  req,
  res
) => {
  try {
    if (!checkTeacher(req, res)) return;

    const { wordId } = req.params;

    const word =
      await Word.findById(wordId);

    if (!word) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    const sentences =
      await Sentence.find({
        wordId,
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      word,
      sentences,
    });

  } catch (error) {
    console.error(
      "Get word details error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch word details",
    });
  }
};


// ========================================
// UPDATE WORD
// ========================================

const updateWord = async (
  req,
  res
) => {
  try {
    if (!checkTeacher(req, res)) return;

    const { wordId } = req.params;

    const {
      word,
      level,
      partOfSpeech,
      meaning,
      hindiHint,
      category,
      isActive,
    } = req.body;

    const updatedWord =
      await Word.findByIdAndUpdate(
        wordId,
        {
          ...(word !== undefined && {
            word: word.toLowerCase().trim(),
          }),

          ...(level !== undefined && {
            level,
          }),

          ...(partOfSpeech !== undefined && {
            partOfSpeech,
          }),

          ...(meaning !== undefined && {
            meaning,
          }),

          ...(hindiHint !== undefined && {
            hindiHint,
          }),

          ...(category !== undefined && {
            category,
          }),

          ...(isActive !== undefined && {
            isActive,
          }),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedWord) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    res.json({
      success: true,
      message:
        "Word updated successfully",
      word: updatedWord,
    });

  } catch (error) {
    console.error(
      "Update word error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update word",
    });
  }
};


// ========================================
// UPDATE SENTENCE
// ========================================

const updateSentence = async (
  req,
  res
) => {
  try {
    if (!checkTeacher(req, res)) return;

    const { sentenceId } = req.params;

    const {
      sentence,
      difficulty,
      context,
      hindiHint,
      isActive,
    } = req.body;

    const updatedSentence =
      await Sentence.findByIdAndUpdate(
        sentenceId,
        {
          ...(sentence !== undefined && {
            sentence,
          }),

          ...(difficulty !== undefined && {
            difficulty,
          }),

          ...(context !== undefined && {
            context,
          }),

          ...(hindiHint !== undefined && {
            hindiHint,
          }),

          ...(isActive !== undefined && {
            isActive,
          }),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedSentence) {
      return res.status(404).json({
        success: false,
        message:
          "Sentence not found",
      });
    }

    res.json({
      success: true,
      message:
        "Sentence updated successfully",
      sentence: updatedSentence,
    });

  } catch (error) {
    console.error(
      "Update sentence error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update sentence",
    });
  }
};


// ========================================
// DELETE SENTENCE
// ========================================

const deleteSentence = async (
  req,
  res
) => {
  try {
    if (!checkTeacher(req, res)) return;

    const { sentenceId } = req.params;

    const sentence =
      await Sentence.findByIdAndUpdate(
        sentenceId,
        {
          isActive: false,
        },
        {
          new: true,
        }
      );

    if (!sentence) {
      return res.status(404).json({
        success: false,
        message:
          "Sentence not found",
      });
    }

    res.json({
      success: true,
      message:
        "Sentence removed successfully",
    });

  } catch (error) {
    console.error(
      "Delete sentence error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to remove sentence",
    });
  }
};


// ========================================
// STUDENT PROGRESS
// ========================================

const getStudentProgress = async (
  req,
  res
) => {
  try {
    if (!checkTeacher(req, res)) return;

    const JoinRequest = require("../models/JoinRequest");
    const connections = await JoinRequest.find({ teacherId: req.user.userId, status: "accepted" }).select("studentId");
    const studentIds = connections.map((item) => item.studentId);
    const progress = await LearningProgress.find({ userId: { $in: studentIds } })
      .populate("userId", "name email role")
      .populate("wordId", "word level")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      progress,
    });

  } catch (error) {
    console.error(
      "Student progress error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch student progress",
    });
  }
};


module.exports = {
  createWord,
  createSentence,
  getTeacherWords,
  getWordDetails,
  updateWord,
  updateSentence,
  deleteSentence,
  getStudentProgress,
  createLesson,
  getTeacherLessons,
  updateLesson,
  deleteLesson,
  getMyTeacherLessons,
};