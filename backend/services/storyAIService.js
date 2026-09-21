const OpenAI = require("openai");
require("dotenv").config();

let openai = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } else {
    console.warn("⚠️ WARNING: OPENAI_API_KEY missing in storyAIService");
  }
} catch (e) { console.error(e); }

const generateStory = async ({ prompt }) => {
  if (!openai) throw new Error("AI Service not configured");
  const response = await openai.responses.create({
    model: "gpt-5.6-luna",
    input: prompt,
  });
  return { story: response.output_text.trim() };
};

module.exports = { generateStory };
