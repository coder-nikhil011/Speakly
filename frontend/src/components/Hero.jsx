import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F5F6F7]">

      {/* Background decoration */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#E5F2FF] blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">

        {/* LEFT SIDE */}
        <div>

          <p className="mb-6 text-sm font-bold tracking-[0.2em] text-[#65B891]">
            ENGLISH FOR REAL LIFE
          </p>

          <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.98] tracking-tight text-[#111111] sm:text-6xl lg:text-7xl">
            Don't just learn English.

            <span className="mt-2 block text-[#111111]">
              Learn to use it.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
            Learn useful words, understand how people actually use them,
            and practice until speaking English feels natural.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">

            <Link to="/signup" className="rounded-xl bg-[#111111] px-7 py-4 font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-[#222222]">
              Start Learning
              <span className="ml-2">→</span>
            </Link>

            <Link to="/signup" className="rounded-xl border border-slate-200 bg-white px-7 py-4 font-bold text-[#111111] transition hover:border-slate-300 hover:bg-[#F5F6F7]">
              I'm a Teacher
            </Link>

          </div>

          <p className="mt-5 text-sm text-slate-400">
            Learn a little. Practice it. Use it.
          </p>

        </div>


        {/* RIGHT SIDE */}
        <div className="relative mx-auto w-full max-w-lg">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70">

            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] font-bold text-white">
                S
              </div>

              <div>
                <p className="font-bold text-[#111111]">
                  Speakly
                </p>

                <p className="text-sm text-slate-400">
                  Your learning partner
                </p>
              </div>

              <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#65B891]" />

            </div>


            <div className="space-y-4 py-7">

              <div className="w-fit max-w-[80%] rounded-2xl rounded-tl-md bg-[#F5F6F7] px-4 py-3 text-sm leading-6 text-slate-700">
                Hey! How was your day?
              </div>

              <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-md bg-[#E5F2FF] px-4 py-3 text-sm leading-6 text-[#111111]">
                Actually, it was pretty good.
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#65B891]">
                <span>✓</span>
                Natural usage
              </div>

            </div>


            <div className="rounded-2xl bg-[#E5F2FF] p-5">

              <p className="text-xs font-semibold text-slate-500">
                TODAY'S FOCUS
              </p>

              <h3 className="mt-1 text-2xl font-extrabold text-[#111111]">
                actually
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Learn how to use this word naturally in conversation.
              </p>

            </div>

          </div>


          <div className="absolute -left-8 top-20 hidden rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold shadow-xl sm:block">
            <span className="mr-2 text-[#65B891]">✓</span>
            Real-life English
          </div>


          <div className="absolute -bottom-6 -right-6 hidden rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold shadow-xl sm:block">
            <span className="mr-2 text-[#65B891]">✦</span>
            Learn. Use. Remember.
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;
