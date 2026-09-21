const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyze spoken text vs target text and provide pronunciation feedback.
 */
const analyzePronunciation = async ({ targetText, spokenText }) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const prompt = `
    You are an expert Linguistic Coach. 
    Compare the User's spoken text against the Target sentence.
    
    Target: "${targetText}"
    User Spoke: "${spokenText}"
    
    Analyze for:
    1. Accuracy: Did they miss any words?
    2. Pronunciation: Based on the transcription, are there likely mispronunciations? (e.g., if "thorough" became "through").
    3. Fluency: Is the structure natural?

    Return ONLY valid JSON:
    {
      "score": (number 0-100),
      "feedback": {
        "correct": ["list of things they did well"],
        "mistakes": [
          {
            "word": "the word they messed up",
            "correction": "how it should be said",
            "phonetic": "phonetic spelling (e.g., 'ker-nel' for colonel)",
            "tip": "short tip to improve"
          }
        ],
        "overallSummary": "Encouraging overall feedback"
      }
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a helpful and precise linguistic coach. Return JSON only." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};

module.exports = {
  analyzePronunciation,
};
