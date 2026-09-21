const { generateAIResponse } = require("../services/aiService");

/**
 * AI Assistant for Teachers:
 * Helps teachers generate lesson ideas, activity suggestions, and vocabulary lists.
 */
const getTeachingAssistant = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Teacher access only" });
    }

    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Please provide a request or topic." });
    }

    const systemPrompt = `
      You are the Speakly AI Teaching Assistant. Your goal is to support language teachers in creating high-quality, engaging, and pedagogically sound lessons.
      
      Your capabilities include:
      1. Lesson Planning: Suggesting structures for a 30-60 minute class.
      2. Vocabulary Suggestions: Recommending words based on a theme or level.
      3. Activity Generation: Creating speaking prompts, role-plays, or writing exercises.
      4. Material Sourcing: Suggesting types of real-world content (articles, videos) to use.
      5. Student Support: Suggesting ways to explain a difficult concept to a struggling student.

      Constraints:
      - Always provide actionable, concrete examples.
      - Ensure the difficulty matches the requested level.
      - Format your output in a structured, easy-to-read JSON format.

      Current Context: ${context || "No specific context provided."}
    `;

    const finalPrompt = `
      Teacher Request: "${prompt}"
      
      Please provide:
      1. A detailed response to the request.
      2. 3-5 suggested follow-up questions the teacher might ask.
      3. If applicable, a list of 5-10 target vocabulary words related to the topic.

      Return ONLY valid JSON:
      {
        "response": "...",
        "followUpSuggestions": ["...", "...", "..."],
        "suggestedVocabulary": [
          { "word": "...", "meaning": "...", "level": "..." }
        ]
      }
    `;

    const aiResponse = await generateAIResponse(systemPrompt + "\n\n" + finalPrompt);
    
    res.json({
      success: true,
      data: JSON.parse(aiResponse)
    });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ success: false, message: "Unable to generate assistance" });
  }
};

module.exports = {
  getTeachingAssistant,
};
