import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createChallenge, getChallenges, completeChallenge } from "../services/challengeService";
import { getStoredUser } from "../services/authService";

function Challenges() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    try { setItems(await getChallenges()); } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const start = async (type) => {
    try {
      const challenge = await createChallenge(type);
      setItems((prev) => [challenge, ...prev]);
      setMessage(`${challenge.title} is ready for you.`);
    } catch (e) {
      setMessage(e.response?.data?.message || "This challenge is not available on your plan.");
      if (e.response?.data?.code === "PLAN_REQUIRED") navigate("/pricing");
    }
  };

  const latest = (type) => items.find((item) => item.type === type && item.status !== "completed");
  const finish = async (id) => { try { const updated = await completeChallenge(id); setItems((prev) => prev.map((item) => item._id === id ? updated : item)); } catch (e) { setMessage("Could not save completion."); } };

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <Link to="/student" className="text-sm font-bold text-slate-500">← Dashboard</Link>
        <div className="mt-10"><p className="text-sm font-bold text-[#65B891]">AI CHALLENGES</p><h1 className="mt-3 text-4xl font-extrabold">A challenge that changes with you.</h1><p className="mt-3 max-w-2xl text-slate-500">Daily and weekly challenges use your learning history, so two students do not receive the same practice.</p></div>
        {message && <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-4 text-sm font-semibold text-slate-600">{message}</div>}
        <Link>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ChallengeCard to="/challenges/daily-challanges" title="Daily Challenge" icon="⚡" text="A short AI-generated task based on the words and skills you recently practiced." onClick={() => start("daily")} existing={latest("daily")} onComplete={finish} />
          <ChallengeCard to="/challenges/weekly-challenges" title="Weekly Challenge" icon="📅" text="A bigger task that combines your recent vocabulary, sentences and speaking practice." onClick={() => start("weekly")} existing={latest("weekly")} onComplete={finish} />
        </div>
        </Link>
        <div className="mt-8 rounded-[2rem] bg-black p-8 text-white sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-neutral-400">CONTEST</p><h2 className="mt-2 text-2xl font-extrabold">Speakly Open Contest</h2><p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400">Like LeetCode: register, receive a challenge designed around your level, and decide yourself whether you finish it. Basic plan does not include contests.</p></div><button onClick={() => start("contest")} className="rounded-xl bg-white px-6 py-3 font-bold text-black">Register for contest</button></div>
          {user?.plan === "Basic" && import.meta.env.VITE_DEVELOPER_MODE !== "true" && <p className="mt-4 text-xs font-semibold text-neutral-500">Available on Premium and Advance.</p>}
        </div>
        {loading ? <p className="mt-8 text-slate-400">Loading your challenge history...</p> : items.length > 0 && <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6"><h2 className="font-bold">Your recent challenges</h2><div className="mt-4 space-y-3">{items.slice(0,8).map((item) => <div key={item._id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"><div><p className="font-bold">{item.title}</p><p className="text-xs text-slate-500">{item.description}</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize">{item.status}</span></div>)}</div></div>}
      </div>
    </div>
  );
}
function ChallengeCard({ title, icon, text, onClick, existing, onComplete }) {
  return <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm"><div className="text-3xl">{icon}</div><h2 className="mt-5 text-2xl font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>{existing && <div className="mt-5 rounded-2xl bg-[#E7F5EF] p-4 text-sm font-semibold text-[#477D65]">Current: {existing.description}<button onClick={() => onComplete(existing._id)} className="mt-3 block rounded-lg bg-black px-3 py-2 text-xs font-bold text-white">Mark complete</button></div>}<button onClick={onClick} className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white">{existing ? "Generate a fresh challenge →" : "Start challenge →"}</button></div>;
}
export default Challenges;
