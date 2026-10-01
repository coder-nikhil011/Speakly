import React from "react";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">

        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#111111] px-8 py-16 text-center sm:px-12 sm:py-20">

          {/* subtle decoration */}
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#E5F2FF] opacity-20 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#DFF5E8] opacity-20 blur-3xl" />


          <div className="relative">

            <p className="text-sm font-bold tracking-[0.2em] text-[#DFF5E8]">
              READY TO SPEAK?
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              The best tutor you'll ever have
              <span className="block text-[#E5F2FF]">
                is already here.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Start with one word. Practice it. Use it.
              Then do it again.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">

              <Link to="/signup" className="rounded-xl bg-white px-7 py-4 font-bold text-[#111111] transition hover:bg-[#DFF5E8]">
                Start Learning →
              </Link>

              <a href="#top" className="rounded-xl border border-white/20 px-7 py-4 font-bold text-white transition hover:bg-white/10">
                Explore Speakly
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default CTA;