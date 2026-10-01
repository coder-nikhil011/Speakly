import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/navbar_logo.png";
import { getSmartRevision, submitRevisionAnswer } from "../services/revisionService";
import { getContentHistory } from "../services/learningService";

function RevisionSession() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [languageHistory, setLanguageHistory] = useState([]);

  useEffect(() => {
    const fetchRevision = async () => {
      try {
        const data = await getSmartRevision();
        const contentHistory = await getContentHistory().catch(() => []);
        setLanguageHistory(contentHistory || []);
        if (data && data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setError("No words available for revision today.");
        }
      } catch (err) {
        setError("Failed to load revision session.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevision();
  }, []);

  const question = questions[questionIndex];

  const isCorrect = selectedAnswer === question?.answer;

  const handleSelect = async (option) => {
    if (answered) return;

    setSelectedAnswer(option);
    setAnswered(true);

    try {
      // Submit answer to backend for tracking
      await submitRevisionAnswer({
        wordId: question._id,
        isCorrect: option === question.answer
      });

      if (option === question.answer) {
        setScore((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };

  const handleContinue = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer("");
    setAnswered(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAF9]">
        <p className="text-lg font-semibold text-slate-400">Preparing your revision...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F8FAF9] px-6 text-center">
        <p className="text-xl font-bold text-slate-600">{error}</p>
        <button
          onClick={() => navigate("/student")}
          className="mt-6 rounded-xl bg-black px-6 py-3 font-bold text-white"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] text-black">

        <main className="flex min-h-screen items-center justify-center px-6">

          <div className="w-full max-w-xl text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E7F5EF] text-3xl font-bold text-[#477D65]">
              ✓
            </div>

            <p className="mt-7 text-sm font-bold tracking-[0.2em] text-[#65B891]">
              REVISION COMPLETE
            </p>

            <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
              Nice work.
            </h1>

            <p className="mt-4 text-slate-500">
              You revised {questions.length} questions from your
              previous learning.
            </p>

            <div className="mt-8 rounded-3xl bg-white p-8">

              <p className="text-sm font-semibold text-slate-400">
                YOUR SCORE
              </p>

              <p className="mt-3 text-5xl font-extrabold">
                {score}/{questions.length}
              </p>

              <p className="mt-3 text-sm text-slate-500">
                {score === questions.length
                  ? "Perfect! You remembered everything."
                  : score >= Math.ceil(questions.length / 2)
                  ? "Good job! Keep practicing the words you missed."
                  : "That's okay. These words need a little more practice."}
              </p>

            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() => navigate("/student")}
                className="flex-1 rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-neutral-800"
              >
                Back to dashboard
              </button>

              <button
                onClick={() => {
                  setQuestionIndex(0);
                  setSelectedAnswer("");
                  setAnswered(false);
                  setScore(0);
                  setFinished(false);
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold transition hover:border-black"
              >
                Revise again
              </button>

            </div>

          </div>

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-black">

      {/* Progress */}
      <div className="h-1 bg-slate-100">

        <div
          className="h-full bg-[#9DD8BD] transition-all duration-500"
          style={{
            width: `${
              ((questionIndex + 1) / questions.length) * 100
            }%`,
          }}
        />

      </div>


      {/* Main */}
      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">

        {/* Header */}
        <div>

          <p className="text-sm font-bold tracking-[0.2em] text-[#65B891]">
            SMART REVISION
          </p>

          <div className="mt-4 flex items-end justify-between gap-4">

            <div>

              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Remember and use it.
              </h1>

              <p className="mt-2 text-slate-500">
                Question {questionIndex + 1} of {questions.length}
              </p>

            </div>

            <div className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">
              Score: {score}
            </div>

          </div>

        </div>


        {/* Question Card */}
        <section className="mt-10 rounded-[2rem] bg-white p-7 shadow-sm sm:p-9">

          {/* Previously learned word */}
          <div className="inline-flex rounded-full bg-[#E7F5EF] px-4 py-2 text-xs font-bold text-[#477D65]">
            Previously learned: {question?.word}
          </div>


          <h2 className="mt-7 text-2xl font-bold leading-9 sm:text-3xl">
            {question?.question}
          </h2>


          {/* Options */}
          <div className="mt-7 space-y-3">

            {question?.options.map((option) => {

              const selected = selectedAnswer === option;
              const correct = option === question.answer;

              let classes =
                "border-slate-200 bg-white hover:border-black";

              if (!answered && selected) {
                classes = "border-black bg-black text-white";
              }

              if (answered && correct) {
                classes = "border-[#65B891] bg-[#E7F5EF]";
              }

              if (answered && selected && !correct) {
                classes = "border-red-300 bg-red-50";
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full rounded-2xl border p-5 text-left font-semibold transition ${classes}`}
                >

                  <div className="flex items-center justify-between gap-4">

                    <span>{option}</span>

                    {answered && correct && (
                      <span className="text-[#477D65]">
                        ✓
                      </span>
                    )}

                    {answered && selected && !correct && (
                      <span className="text-red-500">
                        ✕
                      </span>
                    )}

                  </div>

                </button>
              );
            })}

          </div>


          {/* Feedback */}
          {answered && (

            <div
              className={`mt-6 rounded-2xl p-5 ${
                isCorrect
                  ? "bg-[#E7F5EF]"
                  : "bg-slate-100"
              }`}
            >

              <p className="font-bold">
                {isCorrect
                  ? "Correct! 🎉"
                  : "Not quite."}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {isCorrect
                  ? question?.explanation
                  : `The better sentence is "${question?.answer}"`}
              </p>

            </div>

          )}


          {/* Action */}
          <div className="mt-7">

            {!answered && (
              <p className="text-center text-sm text-slate-400">
                Choose an answer to continue.
              </p>
            )}

            {answered && isCorrect && (
              <button
                onClick={handleContinue}
                className="w-full rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-neutral-800"
              >
                {questionIndex === questions.length - 1
                  ? "Finish revision →"
                  : "Continue →"}
              </button>
            )}

            {answered && !isCorrect && (
              <button
                onClick={handleRetry}
                className="w-full rounded-xl border border-black bg-white px-6 py-4 font-bold transition hover:bg-black hover:text-white"
              >
                Try again
              </button>
            )}

          </div>

        </section>

        {languageHistory.length > 0 && <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-slate-400">LANGUAGE RECALL</p><h2 className="mt-2 text-xl font-bold">Revise your sentences, phrases and modals</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{languageHistory.slice(0, 8).map((item) => <div key={item._id} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">{item.contentType}</p><p className="mt-2 font-semibold text-slate-800">{item.contentText}</p></div>)}</div></section>}

        {/* Bottom tip */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Don't just remember the word — remember how to use it.
        </p>

      </main>

    </div>
  );
}

export default RevisionSession;
