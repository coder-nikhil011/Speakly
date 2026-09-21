import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ScenarioPractice() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState("");
  const [topic, setTopic] = useState("");
  const start = () => { if (scenario.trim()) navigate(`/conversation?friend=AI%20Coach&topic=${encodeURIComponent(topic || "Real-life practice")}&scenario=${encodeURIComponent(scenario)}`); };
  return <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10"><div className="mx-auto max-w-3xl"><Link to="/speaking-practice" className="text-sm font-bold text-slate-500">← Speaking practice</Link><div className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 sm:p-10"><p className="text-xs font-bold uppercase tracking-widest text-[#65B891]">YOUR SCENARIO</p><h1 className="mt-3 text-4xl font-extrabold">Describe the real situation yourself.</h1><p className="mt-3 text-slate-500">The AI will use your situation as the conversation context instead of forcing you into preset scenarios.</p><input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (optional)" className="mt-7 w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-black"/><textarea value={scenario} onChange={(e) => setScenario(e.target.value)} rows={7} placeholder="Example: I have a job interview tomorrow and want to practice answering questions about my projects…" className="mt-4 w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-black"/><button onClick={start} disabled={!scenario.trim()} className="mt-5 rounded-xl bg-black px-7 py-4 font-bold text-white disabled:bg-slate-200">Start this scenario →</button></div></div></div>;
}
