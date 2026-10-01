import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createChallenge, completeChallenge, getChallenges } from "../services/challengeService";
import { getStoredUser } from "../services/authService";

function Contest() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [contest, setContest] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const challenges = await getChallenges();
      setHistory(challenges.filter(c => c.status === "completed"));
    } catch (e) {
      console.error("Error fetching challenge history:", e);
    }
  };

  const register = async () => {
    setIsRegistering(true);
    try {
      const result = await createChallenge("contest");
      setContest(result);
      setMessage("Registration Successful! You are now entered into the arena.");
    } catch (e) {
      setMessage(e.response?.data?.message || "Contest is not available on your plan.");
      if (e.response?.data?.code === "PLAN_REQUIRED") navigate("/pricing");
    } finally {
      setIsRegistering(false);
    }
  };

  const complete = async () => {
    if (!contest) return;
    try {
      const updated = await completeChallenge(contest._id);
      setContest(updated);
      setMessage("Contest marked complete. Your ranking will be announced soon!");
      fetchHistory();
    } catch {
      setMessage("Could not save completion.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <Link to="/student" className="text-sm font-bold text-slate-500">← Dashboard</Link>
        
        <div className="mt-12 rounded-[2.5rem] bg-black p-8 text-white sm:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-800 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">Speakly Arena</p>
            <h1 className="mt-4 text-4xl font-extrabold sm:text-6xl tracking-tight">
              The Language <br /> Coding Contest.
            </h1>
            <p className="mt-6 max-w-2xl text-neutral-300 text-lg leading-relaxed">
              Register for an AI-generated high-stakes contest based on your learning history. 
              Compete with students of your level and climb the global leaderboard.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start">
              {user?.plan === "Basic" && import.meta.env.VITE_DEVELOPER_MODE !== "true" ? (
                <button onClick={() => navigate("/pricing")} className="rounded-2xl bg-white px-8 py-4 font-bold text-black transition hover:bg-slate-100 active:scale-95">
                  Upgrade to Join Arena
                </button>
              ) : (
                <button 
                  onClick={register} 
                  disabled={contest || isRegistering}
                  className="rounded-2xl bg-white px-8 py-4 font-bold text-black transition hover:bg-slate-100 active:scale-95 disabled:bg-neutral-500"
                >
                  {isRegistering ? "Registering..." : contest ? "Registered ✓" : "Register for Contest"}
                </button>
              )}
              
              {contest && (
                <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  Entry Confirmed
                </div>
              )}
            </div>
            {message && <p className="mt-6 text-sm font-bold text-neutral-300 animate-in fade-in slide-in-from-left-2">{message}</p>}
          </div>
        </div>

        {contest && (
          <div className="mt-10 rounded-[2.5rem] border border-slate-200 bg-white p-8 sm:p-12 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Active Challenge</p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">{contest.title}</h2>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 uppercase">
                {contest.status === "completed" ? "Completed" : "In Progress"}
              </div>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed">{contest.description}</p>
            
            <div className="mt-10 rounded-3xl bg-slate-50 p-8 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Personalized Focus</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {(contest.payload?.learnedWords || []).length > 0 ? (
                  contest.payload.learnedWords.map(word => (
                    <span key={word} className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">{word}</span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">General Level Mastery</span>
                )}
              </div>
              
              <button 
                onClick={complete} 
                disabled={contest.status === "completed"} 
                className="w-full rounded-2xl bg-black py-4 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:bg-slate-200 disabled:text-slate-500 active:scale-95"
              >
                {contest.status === "completed" ? "Contest Finished ✓" : "Submit Contest Result"}
              </button>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-sm font-bold text-amber-800">Ranking Announcement</p>
                <p className="text-xs text-amber-700 mt-1">Results and global rankings are announced every Sunday at 8 PM IST.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Recent Completed Challenges</h2>
          <div className="grid gap-4">
            {history.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                <p className="text-slate-400 font-medium">No completed challenges yet. Start your first arena entry above!</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item._id} 
                  onClick={() => setSelectedHistory(item)}
                  className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:border-black hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-xl group-hover:bg-black group-hover:text-white transition-colors">
                      🏆
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">Completed on {new Date(item.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-black transition-colors">View Details →</span>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900">Challenge Review</h2>
                <button onClick={() => setSelectedHistory(null)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Challenge Title</p>
                  <p className="text-lg font-bold text-slate-800">{selectedHistory.title}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
                  <p className="text-slate-600 leading-relaxed">{selectedHistory.description}</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Personalized Focus</p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedHistory.payload?.learnedWords || []).map(word => (
                      <span key={word} className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">{word}</span>
                    )) }
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedHistory(null)}
                  className="w-full rounded-2xl bg-black py-4 font-bold text-white transition hover:bg-neutral-800"
                >
                  Close Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contest;
