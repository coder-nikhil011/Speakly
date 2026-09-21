const library = require("../data/contentLibrary.json");

const getContentLibrary = async (req, res) => {
  const type = req.query.type;
  let data = library;

  if (type === "sentences") data = { sentences: library.sentences };
  if (type === "phrases") data = { phrases: library.phrases };
  if (type === "modalVerbs") data = { modalVerbs: library.modalVerbs };

  res.json({
    success: true,
    ...data,
  });
};

module.exports = { getContentLibrary };
