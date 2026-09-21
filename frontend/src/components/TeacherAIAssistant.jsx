import React, { useState } from "react";
import api from "../services/api";

function TeacherAIAssistant() {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!prompt) return;
    
    try {
      setLoading(true);
      const response = await api.post("/teacher-assistant/assist", { prompt, context });
      setResult(response.data.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error getting AI assistance");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = (suggestion) => {
    setPrompt(suggestion);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold">AI Teaching Assistant</h1>
          <p className="text-slate-500">Get ideas for lessons, activities, and vocabulary suggestions.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-10">
          <form onSubmit={handleAskAI} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">What do you need help with?</label>
              <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Suggest a 30-minute lesson plan for Beginner students about 'Ordering Food at a Restaurant'"
                className="w-full p-4 rounded-2xl border border-slate-200 h-32 focus:ring-2 focus:ring-slate-500 outline-none transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Additional Context (Optional)</label>
              <input 
                value={context} 
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. My students struggle with modal verbs"
                className="w-full p-3 rounded-xl border border-slate-200 outline-none transition"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-600 text-white p-4 rounded-2xl font-bold hover:bg-slate-700 transition disabled:bg-slate-300"
            >
              {loading ? "Generating Ideas..." : "Ask AI Assistant"}
            </button>
          </form>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>💡</span> AI Suggestion
              </h3>
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg">
                {result.response}
              </div>
            </div>

            {result.suggestedVocabulary && result.suggestedVocabulary.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>📚</span> Suggested Vocabulary
                </h3>
                <div className="flex flex-wrap gap-3">
                  {result.suggestedVocabulary.map((v, idx) => (
                    <div key={idx} className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800">{v.word}</span>
                      <span className="mx-2 text-slate-300">|</span>
                      <span className="text-slate-600 text-sm">{v.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h3 className="text-lg font-bold mb-4">Ask a follow-up question:</h3>
              <div className="flex flex-wrap gap-3">
                {result.followUpSuggestions.map((s, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleFollowUp(s)}
                    className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-medium hover:border-slate-400 hover:text-slate-600 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherAIAssistant;
