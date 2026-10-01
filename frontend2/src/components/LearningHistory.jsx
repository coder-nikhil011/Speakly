import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLearningHistory } from "../services/learningService";

function LearningHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLearningHistory().then(setHistory).catch(() => setHistory([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <Link to="/student" className="text-sm font-bold text-slate-500">← Dashboard</Link>
        <h1 className="mt-8 text-4xl font-extrabold">Learning history</h1>
        <p className="mt-2 text-slate-500">Words you have actually practiced, with their current mastery.</p>

        {loading ? <p className="mt-10 text-slate-400">Loading history...</p> : history.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-8 text-slate-500">No learning history yet. Start today’s lesson to build your history.</div>
        ) : (
          <div className="mt-8 space-y-3">
            {history.map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div>
                  <p className="font-bold">{item.wordId?.word || "Unknown word"}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.wordId?.meaning || ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold capitalize">{item.status}</p>
                  <p className="mt-1 text-xs text-slate-400">Score {item.score}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningHistory;
