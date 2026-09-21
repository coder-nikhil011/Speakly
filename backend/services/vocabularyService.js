const Word =
  require("../models/Word");


// ==========================================
// NORMALIZE
// ==========================================

const normalizeWord = (
  word
) => {
  return word
    .trim()
    .toLowerCase();
};


// ==========================================
// FIND
// ==========================================

const findExistingWord =
  async (word) => {
    return await Word.findOne({
      word: normalizeWord(word),
    });
  };


// ==========================================
// ADD
// ==========================================

const addNewWord = async ({
  word,
  meaning,
  partOfSpeech,
  hindiHint,
  level,
  sentences = [],
}) => {
  const normalized =
    normalizeWord(word);

  const existing =
    await findExistingWord(
      normalized
    );

  if (existing) {
    return {
      created: false,
      word: existing,
    };
  }

  const newWord =
    await Word.create({
      word: normalized,

      meaning:
        meaning || "Meaning not available",

      partOfSpeech:
        partOfSpeech || "",

      hindiHint:
        hindiHint || "",

      level:
        level || "intermediate",

      category:
        "discovered",

      sentences,

      isActive: true,

      source: "ai",
    });

  return {
    created: true,
    word: newWord,
  };
};


// ==========================================
// PROCESS DISCOVERED WORDS
// ==========================================

const processDiscoveredWords =
  async (
    discoveredWords,
    level
  ) => {
    const existing = [];
    const added = [];

    for (
      const item of
      discoveredWords
    ) {
      if (!item.word) {
        continue;
      }

      const result =
        await addNewWord({
          word: item.word,
          meaning:
            item.meaning,
          partOfSpeech:
            item.partOfSpeech,
          hindiHint:
            item.hindiHint,
          level,
        });

      if (result.created) {
        added.push(
          result.word
        );
      } else {
        existing.push(
          result.word
        );
      }
    }

    return {
      existing,
      added,
    };
  };


module.exports = {
  normalizeWord,
  findExistingWord,
  addNewWord,
  processDiscoveredWords,
};