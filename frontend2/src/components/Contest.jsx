import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createChallenge, completeChallenge } from "../services/challengeService";
import { getStoredUser } from "../services/authService";

export default function Contest() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [contest, setContest] = useState(null);
  const [message, setMessage] = useState("");
  const register = async () => {
    try { setContest(await createChallenge("contest")); setMessage("You are registered. Complete it whenever you want."); }
    catch (e) { setMessage(e.response?.data?.message || "Contest is not available on your plan."); if (e.response?.data?.code === "PLAN_REQUIRED") navigate("/pricing"); }
  };
  const complete = async () => { if (!contest) return; try { setContest(await completeChallenge(contest._id)); setMessage("Contest marked complete. Your result is saved in your history."); } catch { setMessage("Could not save completion."); } };
  return <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10"><div className="mx-auto max-w-4xl"><Link to="/student" className="text-sm font-bold text-slate-500">← Dashboard</Link><div className="mt-12 rounded-[2rem] bg-black p-8 text-white sm:p-12"><p className="text-xs font-bold uppercase tracking-widest text-neutral-400">SPEAKLY CONTEST</p><h1 className="mt-3 text-4xl font-extrabold">Your language coding arena.</h1><p className="mt-4 max-w-2xl text-neutral-300">Register for an AI-generated contest challenge based on your learning history. It stays separate from your daily class.</p>{user?.plan === "Basic" && import.meta.env.VITE_DEVELOPER_MODE !== "true" ? <button onClick={() => navigate("/pricing")} className="mt-8 rounded-xl bg-white px-6 py-3 font-bold text-black">Upgrade to join</button> : <button onClick={register} className="mt-8 rounded-xl bg-white px-6 py-3 font-bold text-black">{contest ? "Registered ✓" : "Register"}</button>}{message && <p className="mt-4 text-sm text-neutral-400">{message}</p>}</div>{contest && <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7"><p className="text-xs font-bold uppercase tracking-widest text-slate-400">REGISTERED CHALLENGE</p><h2 className="mt-2 text-2xl font-bold">{contest.title}</h2><p className="mt-3 text-slate-600">{contest.description}</p><div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Learned words used for personalization: {(contest.payload?.learnedWords || []).join(", ") || "Your current level"}<button onClick={complete} disabled={contest.status === "completed"} className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white disabled:bg-slate-200">{contest.status === "completed" ? "Completed ✓" : "Mark contest complete"}</button></div></div>}</div></div>;
}
