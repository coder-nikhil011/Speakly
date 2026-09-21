const Word = require("../models/Word");
const wordList = require("../data/wordList.json");

const seedWordList = async () => {
  const operations = wordList.map((item) => ({
    updateOne: {
      filter: { word: item.word.toLowerCase() },
      update: {
        $set: {
          word: item.word.toLowerCase(),
          sourceNumber: item.no,
          meaning: item.meaning,
          partOfSpeech: item.partOfSpeech,
          level: item.level,
          category: item.category,
          sentences: item.sentences || [],
          isActive: true,
          source: "admin",
        },
      },
      upsert: true,
    },
  }));

  if (operations.length) {
    const result = await Word.bulkWrite(operations, { ordered: false });
    console.log(`Word library synced: ${result.upsertedCount || 0} added, ${result.modifiedCount || 0} updated.`);
  }

  return Word.countDocuments({ isActive: true });
};

module.exports = { seedWordList };
