import React, { useState, useEffect } from "react";
import { getWords } from "../services/learningService";

function WordLearning() {
  const [word, setWord] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const data = await getWords();
        if (data && data.length > 0) {
          setWord(data[0]);
        }
      } catch (err) {
        console.error("Error fetching word:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAF9]">
        <p className="text-lg font-semibold text-slate-400">Loading word...</p>
      </div>
    );
  }

  if (!word) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAF9]">
        <p className="text-lg font-semibold text-slate-400">No word found.</p>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 sm:p-12 font-sans selection:bg-slate-100">
      <section className="w-full max-w-2xl bg-white p-10 sm:p-16 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10" />
        
        <div className="space-y-8">
          <div className="inline-block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Daily Vocabulary</p>
            <div className="h-1 w-8 bg-slate-900 mx-auto mt-2 rounded-full" />
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter text-slate-900">
              {word.word}
            </h1>
            <p className="text-xl text-slate-400 font-medium italic">
              {word.partOfSpeech || "Vocabulary"}
            </p>
          </div>

          <div className="py-8 border-y border-slate-50">
            <p className="text-2xl sm:text-3xl text-slate-700 leading-relaxed font-medium">
              {word.meaning}
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => setShowHint(!showHint)}
              className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-95 ${
                showHint 
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
              }`}
            >
              {showHint ? "Hide hint" : "View Hindi Hint"}
            </button>

            {showHint && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <p className="px-6 py-4 rounded-2xl bg-slate-50 text-slate-600 text-lg font-medium border border-slate-100">
                  {word.hindiHint || "The source PDF does not provide a Hindi hint for this word."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default WordLearning;
