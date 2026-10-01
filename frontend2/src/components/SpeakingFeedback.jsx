import React from "react";
function SpeakingFeedback() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8">

      <p className="text-sm font-bold text-[#65B891]">
        SPEAKING FEEDBACK
      </p>

      <h2 className="mt-3 text-3xl font-extrabold">
        Good conversation!
      </h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl bg-[#F8FAF9] p-5">
          <p className="text-sm text-slate-400">
            Fluency
          </p>
          <p className="mt-2 text-3xl font-extrabold">
            82%
          </p>
        </div>

        <div className="rounded-2xl bg-[#F8FAF9] p-5">
          <p className="text-sm text-slate-400">
            Vocabulary
          </p>
          <p className="mt-2 text-3xl font-extrabold">
            76%
          </p>
        </div>

        <div className="rounded-2xl bg-[#F8FAF9] p-5">
          <p className="text-sm text-slate-400">
            Confidence
          </p>
          <p className="mt-2 text-3xl font-extrabold">
            88%
          </p>
        </div>

      </div>

    </div>
  );
}

export default SpeakingFeedback;