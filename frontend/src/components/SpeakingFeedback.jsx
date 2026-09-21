
import React from "react";

function SpeakingFeedback({ analysis }) {
  if (!analysis) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">No feedback available yet. Start speaking to get analyzed!</p>
      </div>
    );
  }

  const { score, feedback } = analysis;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-bold text-[#65B891] uppercase tracking-widest">
            AI Pronunciation Feedback
          </p>
          <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
            {score >= 80 ? "Excellent!" : score >= 60 ? "Good Job!" : "Keep Practicing!"}
          </h2>
        </div>
        <div className="flex items-center justify-center h-16 w-16 rounded-full border-4 border-[#65B891] text-2xl font-black text-slate-800">
          {score}%
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* What went well */}
        <div className="rounded-2xl bg-green-50 p-6 border border-green-100">
          <h3 className="flex items-center gap-2 text-green-700 font-bold mb-3">
            <span>✅</span> What you got right
          </h3>
          <ul className="space-y-2">
            {feedback.correct.map((item, idx) => (
              <li key={idx} className="text-sm text-green-600 flex gap-2">
                <span className="opacity-50">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for improvement */}
        <div className="rounded-2xl bg-amber-50 p-6 border border-amber-100">
          <h3 className="flex items-center gap-2 text-amber-700 font-bold mb-3">
            <span>⚠️</span> Areas to improve
          </h3>
          <div className="space-y-4">
            {feedback.mistakes.length > 0 ? (
              feedback.mistakes.map((mistake, idx) => (
                <div key={idx} className="text-sm p-3 bg-white rounded-xl border border-amber-200 shadow-sm">
                  <p className="font-bold text-slate-800">"{mistake.word}"</p>
                  <p className="text-amber-600 text-xs mt-1">Say it like: <span className="font-mono font-bold">{mistake.phonetic}</span></p>
                  <p className="text-slate-500 text-xs mt-1 italic">{mistake.tip}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-amber-600 italic">No major mistakes detected. Perfect!</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <p className="text-sm font-medium text-slate-600 italic text-center">
          "{feedback.overallSummary}"
        </p>
      </div>
    </div>
  );
}

export default SpeakingFeedback;
