import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function DailyChallenge() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("idle"); // idle, success, failure
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await api.get("/challenges/daily");
        setChallenge(response.data.challenge);
      } catch (err) {
        console.error("Error fetching daily challenge:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, []);

  const handleCheck = async () => {
    if (!answer) return;
    setStatus("checking");
    try {
      const response = await api.post("/challenges/verify", { 
        challengeId: challenge._id, 
        answer 
      });
      if (response.data.correct) {
        setStatus("success");
      } else {
        setStatus("failure");
      }
    } catch (err) {
      setStatus("failure");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#F8FAF9]"><p className="text-slate-400">Loading challenge...</p></div>;

  if (!challenge) return <div className="flex h-screen items-center justify-center bg-[#F8FAF9]"><p className="text-slate-400">No challenge available today.</p></div>;

  return (
    <div className="min-h-screen bg-[#F8FAF9] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link to="/student" className="text-sm font-bold text-slate-500">← Dashboard</Link>
        <div className="mt-8">
          <p className="text-sm font-bold text-[#65B891] uppercase tracking-widest">
            Daily Challenge
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
            {challenge.title || "Complete the sentence"}
          </h1>
          <p className="mt-4 text-slate-500">{challenge.description || "Test your daily vocabulary and grammar."}</p>
        </div>

        <div className="mt-10 rounded-[2.5rem] bg-white p-8 sm:p-12 shadow-sm border border-slate-100">
          <div className="mb-8">
            <p className="text-xl font-semibold text-slate-800 leading-relaxed">
              {challenge.question}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {challenge.options.map((option) => (
              <button
                key={option}
                onClick={() => setAnswer(option)}
                className={`rounded-2xl border p-5 text-left font-bold transition-all duration-200 ${
                  answer === option
                    ? "border-black bg-black text-white shadow-lg"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <button 
              onClick={handleCheck}
              disabled={!answer || status === "checking"}
              className="w-full sm:w-64 rounded-2xl bg-black py-4 font-bold text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              {status === "checking" ? "Checking..." : "Submit Answer"}
            </button>

            {status === "success" && <p className="text-green-600 font-bold animate-bounce">Correct! 🎉 +10 XP earned</p>}
            {status === "failure" && <p className="text-red-500 font-bold">Not quite. Try another option!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyChallenge;
