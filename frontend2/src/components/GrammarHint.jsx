import React from "react";
function GrammarHint({ word = "have to" }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7">

      <p className="text-xs font-bold tracking-wider text-[#65B891]">
        GRAMMAR HINT
      </p>

      <h2 className="mt-3 text-2xl font-bold">
        {word}
      </h2>

      <p className="mt-3 text-slate-500">
        Use this when something is necessary or required.
      </p>

      <div className="mt-5 rounded-2xl bg-[#F8FAF9] p-5">
        <p className="font-semibold">
          I have to leave now.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Yahan "have to" ka meaning hai ki jaana zaroori hai.
        </p>
      </div>

    </section>
  );
}

export default GrammarHint;