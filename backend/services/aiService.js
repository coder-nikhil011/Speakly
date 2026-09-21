const OpenAI = require("openai");
require("dotenv").config();

let openai = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } else {
    console.warn("⚠️ WARNING: OPENAI_API_KEY is missing. AI features will not work.");
  }
} catch (error) {
  console.error("Error initializing OpenAI:", error);
}

/**
 * Generic AI Response helper for Tutor flows.
 */
const generateAIResponse = async (prompt) => {
  if (!openai) {
    throw new Error("AI Service is not configured. Please add OPENAI_API_KEY to .env");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o", 
    messages: [{ role: "system", content: "You are a helpful language tutor." }, { role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return response.choices[0].message.content;
};

const generateLearningSentence = async ({
  targetWord,
  targetMeaning,
  studentLevel,
  previousWords = [],
  previousSentences = [],
}) => {
  if (!openai) {
    throw new Error("AI Service is not configured. Please add OPENAI_API_KEY to .env");
  }

  const prompt = `
You are the AI learning engine for Speakly.
Target word: ${targetWord}
Target meaning: ${targetMeaning}
Student level: ${studentLevel}
Previously learned words: ${previousWords.join(", ")}
Previously used sentences: ${previousSentences.join("\n")}

Return ONLY valid JSON:
{
  "sentence": "...",
  "hindiHint": "...",
  "context": "..."
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0].message.content.trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("AI returned invalid sentence data");
  }
};

const generateRevisionQuestion = async ({
  word,
  meaning,
  sentence,
  previousWords = [],
}) => {
  if (!openai) {
    throw new Error("AI Service is not configured. Please add OPENAI_API_KEY to .env");
  }

  const prompt = `
You are Speakly's smart revision engine.
Target word: ${word}
Meaning: ${meaning}
Previous sentence: ${sentence}
Previously learned words: ${previousWords.join(", ")}

Return ONLY JSON:
{
  "questionType": "fill_blank",
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correctAnswer": "...",
  "hint": "..."
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0].message.content.trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("AI returned invalid revision data");
  }
};

module.exports = {
  generateAIResponse,
  generateLearningSentence,
  generateRevisionQuestion,
};
