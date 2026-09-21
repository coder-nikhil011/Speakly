import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { getStoredUser } from "../services/authService";

export default function AIFriend() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const requestedMode = params.get("mode") || "video";
  const user = getStoredUser();
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [scenario, setScenario] = useState("");
  const [gender, setGender] = useState("female");
  const [language, setLanguage] = useState("auto");
  const plan = user?.plan || "Basic";
  const isVideoAllowed = plan !== "Basic" || import.meta.env.VITE_DEVELOPER_MODE === "true";
  const limits = { Basic: "2 hours/day", Premium: "5 hours/day", Advance: "10 hours/day" };
  const start = () => {
    if (!name.trim() || !topic.trim()) return;
    const query = `friend=${encodeURIComponent(name.trim())}&topic=${encodeURIComponent(topic.trim())}&story=${encodeURIComponent(scenario.trim())}&gender=${gender}&language=${language}`;
    const useVideo = requestedMode === "video" && isVideoAllowed;
    navigate(useVideo ? `/ai-video-call?${query}` : `/ai-chat?${query}`);
  };
  return <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10"><div className="mx-auto max-w-4xl"><Link to="/speaking-practice" className="text-sm font-bold text-slate-500">← Speaking practice</Link><div className="mt-10 rounded-[2rem] bg-white border border-slate-200 p-7 sm:p-10"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#65B891]">CREATE YOUR AI FRIEND</p><h1 className="mt-3 text-4xl font-extrabold">Practice around your real story.</h1><p className="mt-3 max-w-2xl text-slate-500">Give your AI friend a name, describe your situation or story, and ask anything related to it. Speakly keeps the AI focused on your scenario and can add new vocabulary to the word bank.</p></div><span className="rounded-full bg-[#E7F5EF] px-4 py-2 text-xs font-bold text-[#477D65]">{plan} · {limits[plan]}</span></div><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">AI friend name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Siri, Jarvis, Alex" className="mt-2 w-full rounded-xl border border-slate-200 p-4 font-normal outline-none focus:border-black"/></label><label className="text-sm font-bold">Your topic<input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. job interview, college presentation" className="mt-2 w-full rounded-xl border border-slate-200 p-4 font-normal outline-none focus:border-black"/></label></div><label className="mt-5 block text-sm font-bold">Your story / scenario<textarea value={scenario} onChange={(e) => setScenario(e.target.value)} rows={6} placeholder="Tell your AI friend what is happening. Example: I have a presentation tomorrow and I am nervous about answering questions from the teacher." className="mt-2 w-full rounded-xl border border-slate-200 p-4 font-normal outline-none focus:border-black"/></label><div className="mt-5"><p className="text-sm font-bold">AI character</p><div className="mt-2 grid grid-cols-2 gap-3"><button type="button" onClick={()=>setGender("female")} className={`rounded-xl border p-4 text-left ${gender === "female" ? "border-black bg-black text-white" : "border-slate-200 bg-white"}`}><span className="text-2xl">👩</span><p className="mt-2 font-bold">Female</p></button><button type="button" onClick={()=>setGender("male")} className={`rounded-xl border p-4 text-left ${gender === "male" ? "border-black bg-black text-white" : "border-slate-200 bg-white"}`}><span className="text-2xl">👨</span><p className="mt-2 font-bold">Male</p></button></div></div><label className="mt-5 block text-sm font-bold">Conversation language<select value={language} onChange={(e)=>setLanguage(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 p-4 font-normal outline-none focus:border-black"><option value="auto">Auto — follow my language</option><option value="english">English</option><option value="hindi">Hindi + English teaching</option><option value="hinglish">Hinglish</option></select></label><button onClick={start} disabled={!name.trim() || !topic.trim()} className="mt-6 rounded-xl bg-black px-7 py-4 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-200">{isVideoAllowed ? "Start AI video call →" : "Start AI chat →"}</button>{!isVideoAllowed && <p className="mt-3 text-sm font-semibold text-slate-500">Basic includes the full AI chat experience. AI Video Call unlocks on Premium and Advance.</p>}<p className="mt-4 text-xs text-slate-400">AI time counts only while your AI session is active, not while Speakly is simply open.</p></div></div></div>;
}
