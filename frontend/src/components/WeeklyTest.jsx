import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/navbar_logo.png";
import api from "../services/api";

function WeeklyTest() {
  const navigate = useNavigate();
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await api.get("/weekly-test/generate");
        setTestData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load weekly test.");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, []);

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/weekly-test/submit", { answers, testData });
      setResult(response.data);
      setSubmitted(true);
    } catch (err) {
      alert("Error submitting test. Please try again.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAF9]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium">AI is crafting your weekly story test...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#F8FAF9] px-6 text-center">
      <h2 className="text-2xl font-bold text-slate-900">No Test Available</h2>
      <p className="mt-2 text-slate-500">{error}</p>
      <Link to="/student" className="mt-6 font-bold underline">Back to Dashboard</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAF9] pb-20">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/student" className="flex items-center gap-4">
            <span className="text-2xl cursor-pointer">←</span>
            <img src={logo} alt="Speakly" className="h-10 w-auto object-contain" />
          </Link>
          <span className="rounded-full bg-slate-100 px-4 py-1 text-xs font-bold text-slate-600">
            WEEKLY VOCAB TEST
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Story Section */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-4 text-slate-900">The Story</h2>
              <p className="text-lg leading-relaxed text-slate-700 italic">
                "{testData?.story}"
              </p>
            </div>

            {/* Questions Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Fill in the Blanks</h2>
              {testData?.questions.map((q, idx) => (
                <div key={q.id} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                  <p className="text-md font-medium text-slate-800 mb-4">
                    {idx + 1}. {q.text}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleOptionChange(q.id, option)}
                        className={`text-left px-4 py-3 rounded-xl border transition text-sm font-medium ${
                          answers[q.id] === option 
                          ? "border-black bg-black text-white" 
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="submit"
              disabled={Object.keys(answers).length < testData?.questions.length}
              className="w-full rounded-2xl bg-black py-4 font-bold text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              Submit Test
            </button>
          </form>
        ) : (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-4xl mb-6">
              🎉
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Test Completed!</h2>
            <p className="mt-2 text-lg text-slate-600">
              You scored <span className="font-bold text-black">{result?.score}%</span>
            </p>
            <p className="mt-4 text-slate-500 max-w-md mx-auto leading-relaxed">
              {result?.message}
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button 
                onClick={() => navigate("/student")}
                className="rounded-xl bg-black px-8 py-3 font-bold text-white transition hover:bg-neutral-800"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default WeeklyTest;
