import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logo from "../assets/navbar_logo.png";
import { getLearningProgress } from "../services/learningService";

function Progress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getLearningProgress();
        setProgress(data);
      } catch (err) {
        setError("Failed to load progress data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAF9]">
        <p className="text-lg font-semibold text-slate-400">Loading progress...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F8FAF9] px-6 text-center">
        <p className="text-xl font-bold text-slate-600">{error}</p>
        <Link
          to="/student"
          className="mt-6 rounded-xl bg-black px-6 py-3 font-bold text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 sm:p-10">

      <div className="mx-auto max-w-6xl">

        <Link
          to="/student"
          className="text-3xl font-extrabold"
        >
        </Link>

        <div className="mt-12">

          <p className="text-sm font-bold text-[#65B891]">
            YOUR PROGRESS
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            See how far you've come.
          </h1>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <Stat title="Words learned" value={progress?.wordsLearned || 0} />
            <Stat title="Sentences practiced" value={progress?.sentencesPracticed || 0} />
            <Stat title="Speaking sessions" value={progress?.sessions || 0} />
            <Stat title="Current streak" value={`${progress?.streak || 0} days`} />

          </div>

          <div className="mt-6 rounded-3xl bg-white p-8">

            <h2 className="text-2xl font-bold">
              Learning progress
            </h2>

            <div className="mt-7 h-4 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-[#9DD8BD]"
                style={{ width: `${progress?.percentage || 0}%` }}
              />

            </div>

            <p className="mt-3 text-sm text-slate-500">
              {progress?.percentage || 0}% of your current learning goal completed.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-extrabold">
        {value}
      </p>

    </div>
  );
}

export default Progress;
