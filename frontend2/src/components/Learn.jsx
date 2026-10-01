import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getContentHistory, getLearningHistory, getTodayClass, getWords, saveContentPractice, saveLearningProgress, getDailyLearningStatus, completeDailyLearning } from "../services/learningService";

const TYPES = ["word", "sentence", "phrase", "modal"];

function Learn() {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [content, setContent] = useState({ sentences: [], phrases: [], modals: [] });
  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(0);
  const [sentenceInput, setSentenceInput] = useState("");
  const [attempt, setAttempt] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [completedToday, setCompletedToday] = useState(false);

  useEffect(() => {
    Promise.all([getWords(), getTodayClass(), getContentHistory(), getLearningHistory(), getDailyLearningStatus()])
      .then(([wordData, classData, historyData, wordHistory, dailyStatus]) => {
        setWords(wordData || []);
        setContent(classData || { sentences: [], phrases: [], modals: [] });
        setCompletedToday(Boolean(classData?.completedToday || dailyStatus?.completedToday));
        setHistory([...(wordHistory || []).map((item) => ({ ...item, historyLabel: item.wordId?.word || "Word practice" })), ...(historyData || []).map((item) => ({ ...item, historyLabel: item.contentText }))]);
      })
      .catch((error) => console.error("Learn load error", error))
      .finally(() => setLoading(false));
  }, []);

  const queue = useMemo(() => [
    ...words.map((item) => ({ type: "word", item })),
    ...(content.sentences || []).map((item) => ({ type: "sentence", item })),
    ...(content.phrases || []).map((item) => ({ type: "phrase", item })),
    ...(content.modals || []).map((item) => ({ type: "modal", item })),
  ], [words, content]);

  const current = queue[step];
  const progress = queue.length ? Math.round(((step + 1) / queue.length) * 100) : 0;

  const resetInputs = () => {
    setSentenceInput("");
    setAttempt("");
    setMessage("");
  };

  const next = async () => {
    if (!current) return;
    try {
      if (current.type === "word") {
        const word = current.item;
        const used = sentenceInput.toLowerCase().includes(word.word.toLowerCase());
        if (!used) {
          setMessage(`Use “${word.word}” in your own sentence before moving on.`);
          return;
        }
        await saveLearningProgress({ wordId: word._id, status: "learned", score: 100, correct: true });
      } else {
        const text = attempt.trim();
        if (!text) {
          setMessage("Try it in your own sentence first.");
          return;
        }
        const source = current.item.text || current.item.phrase || `${current.item.modal}: ${current.item.example || ""}`;
        const contentKey = current.type === "modal" ? current.item.modal : source;
        await saveContentPractice({ contentType: current.type, contentKey, contentText: text, correct: true });
      }
      if (step < queue.length - 1) {
        setStep((value) => value + 1);
        resetInputs();
      } else {
        await completeDailyLearning();
        setCompletedToday(true);
        setCompleted(true);
        setMessage("Today's class is complete. Your practice has been added to history.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save this practice. Please try again.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9] text-slate-400">Preparing your class...</div>;
  if (completedToday) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9] p-6"><div className="max-w-lg text-center"><h1 className="text-3xl font-extrabold">You are caught up 🎉</h1><p className="mt-3 text-slate-500">Your task for today is already complete. Come back tomorrow for your next class.</p><button onClick={() => navigate("/student")} className="mt-6 rounded-xl bg-black px-6 py-3 font-bold text-white">Back to dashboard</button></div></div>;

  if (completed) return <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-6"><div className="max-w-xl text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E7F5EF] text-3xl">✓</div><p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#65B891]">CLASS COMPLETE</p><h1 className="mt-3 text-4xl font-extrabold">Nice work. See you tomorrow.</h1><p className="mt-4 text-slate-500">Your words, sentences, phrases and modal practice have been saved to your history.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><button onClick={() => navigate("/revision-session")} className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold">Revise previous work</button><button onClick={() => navigate("/student")} className="flex-1 rounded-xl bg-black px-6 py-4 font-bold text-white">Back to dashboard</button></div></div></div>;

  const isWord = current.type === "word";
  const sourceText = current.item.text || current.item.phrase || "";

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900">
      <div className="h-1 bg-slate-100"><div className="h-full bg-[#65B891] transition-all" style={{ width: `${progress}%` }} /></div>
      <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#65B891]">TODAY'S CLASS</p><h1 className="mt-2 text-3xl font-extrabold sm:text-5xl">Learn. Use it. Remember it.</h1></div>
          <Link to="/student" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold">Exit</Link>
        </div>
        <p className="mt-3 text-slate-500">Step {step + 1} of {queue.length}. New items appear one at a time; completed work goes into your history.</p>

        <section className="mt-8 rounded-[2rem] bg-black p-8 text-white sm:p-12">
          <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-300">{current.type}</span>
          {isWord ? (
            <><h2 className="mt-7 text-6xl font-extrabold sm:text-7xl">{current.item.word}</h2><p className="mt-3 text-lg text-neutral-400">{current.item.partOfSpeech || "Vocabulary"}</p><p className="mt-7 max-w-2xl text-xl font-medium">{current.item.meaning}</p><p className="mt-4 text-sm text-neutral-400">Use this word in your own sentence. You can try 1–2 sentences before continuing.</p></>
          ) : current.type === "sentence" ? (
            <><h2 className="mt-7 text-3xl font-extrabold">Use this sentence naturally</h2><p className="mt-5 rounded-2xl bg-white/10 p-5 text-lg">“{sourceText}”</p><p className="mt-4 text-sm text-neutral-400">Rewrite it in your own words or create a similar sentence.</p></>
          ) : current.type === "phrase" ? (
            <><h2 className="mt-7 text-4xl font-extrabold">{current.item.phrase}</h2><p className="mt-4 text-neutral-300">Use this phrase in a real situation of your choice.</p></>
          ) : (
            <><h2 className="mt-7 text-5xl font-extrabold">{current.item.modal}</h2><p className="mt-4 text-lg text-neutral-300">{current.item.use}</p><p className="mt-5 rounded-2xl bg-white/10 p-5">Example: {current.item.example}</p></>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">YOUR PRACTICE</p>
          <h2 className="mt-2 text-xl font-bold">Now make it yours</h2>
          <textarea value={isWord ? sentenceInput : attempt} onChange={(e) => isWord ? setSentenceInput(e.target.value) : setAttempt(e.target.value)} rows={4} placeholder={isWord ? `Write a sentence using “${current.item.word}”...` : "Write 1–2 sentences using today's item..."} className="mt-5 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-black" />
          {message && <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">{message}</div>}
          <button onClick={next} className="mt-5 rounded-xl bg-black px-7 py-4 font-bold text-white hover:bg-neutral-800">{step === queue.length - 1 ? "Finish today's class →" : "Next →"}</button>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">YOUR HISTORY</p><h2 className="mt-1 text-lg font-bold">Previous language practice</h2></div><span className="rounded-full bg-[#E7F5EF] px-3 py-1 text-xs font-bold text-[#477D65]">{history.length} completed</span></div>
          {history.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{history.slice(0, 12).map((item, index) => <span key={item._id || index} className="rounded-full bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">{item.historyLabel || item.contentText}</span>)}</div>}
        </section>
      </main>
    </div>
  );
}
export default Learn;
