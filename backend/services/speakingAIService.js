const OpenAI = require("openai");
require("dotenv").config();

let openai = null;
if (process.env.OPENAI_API_KEY) {
  try { openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); }
  catch (e) { console.error("OpenAI initialization failed:", e.message); }
}

const generateAIResponse = async ({ messages = [], level = "intermediate", friendName = "AI Friend", personality = "friendly", topic = "General Conversation", preferredLanguage = "auto", story = "" }) => {
  if (!openai) throw new Error("AI Service is not configured. Please add OPENAI_API_KEY to .env");
  const system = `You are ${friendName}, Speakly's personal language-learning AI friend.\n` +
    `Student level: ${level}. Personality: ${personality}.\n` +
    `The student's scenario/topic is: ${topic}.\n` +
    `Student story/context: ${story || "No story supplied."}\n` +
    `Preferred response language: ${preferredLanguage}. If Hindi is selected, answer naturally in Hindi/Hinglish when useful while still teaching English. If auto, follow the user's language.\n` +
    `Stay tightly relevant to the student's story and questions. Explain words, grammar, situations and sentence choices when asked. Do not abandon the student's scenario. Correct English gently and give a better sentence when useful. Keep replies conversational, useful and level-appropriate. Do not claim to be a human.`;
  const cleanMessages = messages.slice(-30).map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "") }));
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_SPEAKING_MODEL || "gpt-4o",
    messages: [{ role: "system", content: system }, ...cleanMessages],
    temperature: 0.7,
  });
  return { reply: response.choices?.[0]?.message?.content?.trim() || "Let's continue. Tell me more." };
};

const generateSpeakingResponse = async ({ message, context }) => generateAIResponse({ messages: [{ role: "user", content: message }], topic: context });

module.exports = { generateAIResponse, generateSpeakingResponse };
