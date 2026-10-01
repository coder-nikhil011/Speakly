import { Link } from "react-router-dom";
import React from "react";

function WordResult() {
  return (
    <section className="rounded-3xl bg-[#E7F5EF] p-8">

      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl font-bold">
        ✓
      </div>

      <p className="mt-6 text-sm font-bold tracking-wider text-[#477D65]">
        WELL DONE
      </p>

      <h2 className="mt-2 text-3xl font-extrabold">
        You learned this word.
      </h2>

      <p className="mt-3 text-slate-600">
        We'll bring it back during smart revision so you don't forget it.
      </p>

      <Link
        to="/student"
        className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-bold text-white"
      >
        Continue →
      </Link>

    </section>
  );
}

export default WordResult;