import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import logo from "../assets/navbar_logo.png";
import api from "../services/api";
import { startSpeakingSession, sendSpeakingMessage, getSessionMessages, endSpeakingSession } from "../services/speakingService";

const PLAN_LIMITS = { Basic: 2 * 60 * 60, Premium: 5 * 60 * 60, Advance: 10 * 60 * 60 };

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
}

export default function AIVideoCall() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const friendName = params.get("friend") || "AI Friend";
  const topic = params.get("topic") || "General English";
  const scenario = params.get("story") || params.get("scenario") || "";
  const language = params.get("language") || "auto";
  const gender = params.get("gender") === "male" ? "male" : "female";
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({ usedSeconds: 0, limitSeconds: PLAN_LIMITS.Basic });
  const [usageSessionId, setUsageSessionId] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef(null);
  const speechTimer = useRef(null);

  const avatarLabel = useMemo(() => gender === "male" ? "AI" : "AI", [gender]);
  const remaining = Math.max(0, usage.limitSeconds - usage.usedSeconds);

  const speak = (text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = gender === "male" ? 0.88 : 1.12;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => gender === "male" ? /male|david|mark|daniel/i.test(v.name) : /female|zira|samantha|karen|susan/i.test(v.name));
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startUsage = async () => {
    const res = await api.post("/ai-usage/start");
    setUsageSessionId(res.data.sessionId);
    setUsage({ usedSeconds: res.data.usedSeconds, limitSeconds: res.data.limitSeconds });
    return res.data.sessionId;
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        await startUsage();
        const data = await startSpeakingSession({ friendName, topic, story: scenario, preferredLanguage: language, personality: `${gender} Jarvis-style AI assistant`, level: "intermediate", voice: gender, mode: "video" });
        const id = data.session?.id || data.sessionId;
        if (!mounted) return;
        setSessionId(id);
        const initial = await getSessionMessages(id);
        const list = initial.messages || initial || [];
        setMessages(list.map(m => ({ ...m, text: m.text || m.content })));
        const welcome = list.find(m => m.role === "assistant");
        if (welcome) setTimeout(() => speak(welcome.text || welcome.content), 300);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Unable to start the AI video call. Your daily AI limit may be reached.");
        navigate("/speaking-practice");
      } finally { if (mounted) setLoading(false); }
    };
    init();
    return () => { mounted = false; window.speechSynthesis?.cancel(); };
  }, []);

  useEffect(() => {
    if (!usageSessionId) return;
    const heartbeat = async () => {
      try {
        const res = await api.post("/ai-usage/heartbeat", { sessionId: usageSessionId });
        setUsage(prev => ({ ...prev, usedSeconds: res.data.usedSeconds, limitSeconds: res.data.limitSeconds }));
        if (res.data.limitReached) endCall(true);
      } catch {}
    };
    const id = setInterval(heartbeat, 10000);
    heartbeat();
    return () => clearInterval(id);
  }, [usageSessionId]);

  useEffect(() => {
    const onVisibility = async () => {
      if (document.hidden && usageSessionId) {
        // Pause the AI timer when the AI call is no longer visible.
        try { await api.post("/ai-usage/stop", { sessionId: usageSessionId }); } catch {}
        setUsageSessionId(null);
      } else if (!document.hidden && !usageSessionId && sessionId) {
        try { await startUsage(); } catch {}
      }
    };
    const onBeforeUnload = () => {
      if (!usageSessionId) return;
      const token = localStorage.getItem("token");
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/ai-usage/stop`, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ sessionId: usageSessionId }),
      }).catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => { document.removeEventListener("visibilitychange", onVisibility); window.removeEventListener("beforeunload", onBeforeUnload); };
  }, [usageSessionId, sessionId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const endCall = async (limitReached = false) => {
    window.speechSynthesis?.cancel();
    if (sessionId) await endSpeakingSession(sessionId).catch(() => {});
    if (usageSessionId) await api.post("/ai-usage/stop", { sessionId: usageSessionId }).catch(() => {});
    setUsageSessionId(null);
    if (limitReached) alert("Your daily AI time is finished for today.");
    navigate("/speaking-practice");
  };

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || typing || remaining <= 0) return;
    const text = input.trim(); setInput("");
    setMessages(prev => [...prev, { role: "user", text }]); setTyping(true);
    try {
      const res = await sendSpeakingMessage({ sessionId, message: text });
      const reply = res.assistantMessage?.content || res.reply || "Let's continue.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
      speak(reply);
    } catch (error) {
      if (error.response?.status === 429) alert("Your daily AI time limit has been reached.");
    } finally { setTyping(false); }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#08090b] text-white"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white"/><p className="mt-4 text-sm text-white/60">Connecting to your AI assistant…</p></div></div>;

  return <div className="min-h-screen bg-[#08090b] text-white">
    <header className="flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-4 backdrop-blur-xl">
      <Link to="/speaking-practice" className="flex items-center gap-3"><span className="text-xl">←</span><img src={logo} className="h-8 w-auto" alt="Speakly"/></Link>
      <div className="text-right"><p className="text-sm font-bold">{friendName}</p><p className="text-[11px] text-white/45">AI Video Assistant · {gender}</p></div>
      <div className="flex items-center gap-3"><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">AI time {formatTime(remaining)} left</span><button onClick={() => endCall()} className="rounded-xl bg-red-500/15 px-4 py-2 text-xs font-bold text-red-300">End call</button></div>
    </header>

    <main className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[1fr_380px]">
      <section className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,#1c242b_0%,#08090b_60%)] p-6">
        <div className="absolute left-8 top-8"><p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">Live AI video</p><p className="mt-1 text-sm text-white/50">{topic}</p></div>
        <div className="relative flex h-[min(64vw,540px)] w-[min(64vw,540px)] min-h-[320px] min-w-[320px] items-center justify-center rounded-[3rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] shadow-[0_0_100px_rgba(74,222,128,.08)]">
          <div className={`relative h-[65%] w-[52%] rounded-[48%_48%_42%_42%] bg-gradient-to-b ${gender === "male" ? "from-slate-400 via-slate-700 to-slate-950" : "from-rose-200 via-rose-500/50 to-slate-950"} shadow-2xl`}>
            <div className="absolute left-1/2 top-[10%] h-[19%] w-[56%] -translate-x-1/2 rounded-full bg-black/15"/>
            <div className="absolute left-[23%] top-[42%] h-3 w-7 rounded-full bg-white/90"/><div className="absolute right-[23%] top-[42%] h-3 w-7 rounded-full bg-white/90"/>
            <div className={`absolute left-1/2 top-[57%] h-2 w-16 -translate-x-1/2 rounded-full bg-black/60 transition-all duration-150 ${speaking ? "h-5 rounded-[40%]" : ""}`}/>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs font-bold backdrop-blur">{avatarLabel} · {gender === "male" ? "Male" : "Female"}</div>
          </div>
          {speaking && <div className="absolute bottom-12 flex gap-1"><span className="h-2 w-2 animate-bounce rounded-full bg-emerald-300"/><span className="h-4 w-2 animate-bounce rounded-full bg-emerald-300 [animation-delay:.1s]"/><span className="h-6 w-2 animate-bounce rounded-full bg-emerald-300 [animation-delay:.2s]"/><span className="h-3 w-2 animate-bounce rounded-full bg-emerald-300 [animation-delay:.3s]"/></div>}
        </div>
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-xs text-white/45"><span>Jarvis-style conversational assistant</span><span>Voice + animated face</span></div>
      </section>

      <aside className="flex min-h-[calc(100vh-73px)] flex-col border-l border-white/10 bg-[#101216]">
        <div className="border-b border-white/10 px-5 py-5"><h2 className="font-bold">Conversation</h2><p className="mt-1 text-xs text-white/40">Chat with {friendName} while the assistant speaks.</p></div>
        <div className="flex-1 space-y-3 overflow-y-auto p-5">{messages.map((m,i) => <div key={i} className={m.role === "user" ? "ml-8" : "mr-8"}><div className={`rounded-2xl p-3 text-sm ${m.role === "user" ? "bg-emerald-500/15 text-emerald-50" : "bg-white/5 text-white/80"}`}><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/35">{m.role === "user" ? "You" : friendName}</p>{m.text || m.content}</div></div>)}{typing && <div className="rounded-2xl bg-white/5 p-3 text-xs text-white/40">AI is thinking…</div>}<div ref={bottomRef}/></div>
        <form onSubmit={send} className="border-t border-white/10 p-4"><div className="flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Talk to your AI assistant…" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-emerald-300/40"/><button className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-black disabled:opacity-40" disabled={!input.trim() || typing || remaining <= 0}>Send</button></div></form>
      </aside>
    </main>
  </div>;
}
