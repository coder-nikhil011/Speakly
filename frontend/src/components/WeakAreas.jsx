import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getLearningHistory } from "../services/learningService";

function WeakAreas() {
  const [history, setHistory] = useState([]);
  useEffect(() => { getLearningHistory().then(setHistory).catch(() => setHistory([])); }, []);

  const stats = useMemo(() => {
    const total = history.length;
    const avg = total ? Math.round(history.reduce((sum, item) => sum + (item.score || 0), 0) / total) : 0;
    const weak = history.filter((item) => (item.score || 0) < 60).slice(0, 6);
    return { total, avg, weak };
  }, [history]);

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <Link to="/student" className="text-sm font-bold text-slate-500">← Dashboard</Link>
        <p className="mt-8 text-sm font-bold tracking-wider text-[#65B891]">LEARNING INSIGHTS</p>
        <h1 className="mt-3 text-4xl font-extrabold">Areas to improve</h1>
        <p className="mt-2 text-slate-500">These insights are calculated from your real vocabulary attempts.</p>

        {stats.total === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-8 text-slate-500">Complete a few vocabulary questions and your weak areas will appear here.</div>
        ) : (
          <>
            <div className="mt-8 rounded-3xl bg-white p-7">
              <div className="flex items-center justify-between"><span className="font-bold">Vocabulary accuracy</span><strong>{stats.avg}%</strong></div>
              <div className="mt-4 h-3 rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#9DD8BD]" style={{ width: `${stats.avg}%` }} /></div>
              <p className="mt-3 text-sm text-slate-500">Based on {stats.total} learned words.</p>
            </div>
            <div className="mt-6 space-y-3">
              {stats.weak.length ? stats.weak.map((item) => (
                <div key={item._id} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex justify-between"><strong>{item.wordId?.word}</strong><span>{item.score}%</span></div>
                  <p className="mt-2 text-sm text-slate-500">{item.wordId?.meaning}</p>
                </div>
              )) : <div className="rounded-3xl bg-white p-8 text-slate-500">No weak words detected yet. Keep practicing.</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default WeakAreas;
