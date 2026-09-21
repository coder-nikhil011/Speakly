import React from "react";
function ForStudents() {
  return (
    <section id="student" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Content */}
          <div>

            <p className="text-sm font-bold tracking-[0.2em] text-[#65B891]">
              FOR LEARNERS
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#111111] sm:text-5xl">
              Learn English
              <span className="block">without feeling overwhelmed.</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Speakly gives you a simple way to learn useful words,
              understand how they are used, and practice them until
              you feel comfortable using them yourself.
            </p>

            <div className="mt-8 space-y-4">

              <div className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5F2FF] font-bold">
                  ✓
                </span>

                <div>
                  <h3 className="font-bold text-[#111111]">
                    Learn useful words
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Focus on words you can actually use.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DFF5E8] font-bold">
                  ✓
                </span>

                <div>
                  <h3 className="font-bold text-[#111111]">
                    Practice your way
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Create sentences and get feedback.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5F2FF] font-bold">
                  ✓
                </span>

                <div>
                  <h3 className="font-bold text-[#111111]">
                    Build confidence
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Turn what you know into something you can speak.
                  </p>
                </div>
              </div>

            </div>

            <button className="mt-9 rounded-xl bg-[#111111] px-7 py-4 font-bold text-white transition hover:bg-[#222222]">
              Start Learning →
            </button>

          </div>


          {/* Visual */}
          <div className="rounded-[2rem] bg-[#F5F6F7] p-6">

            <div className="rounded-3xl bg-white p-6 shadow-lg">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-widest text-[#65B891]">
                    TODAY
                  </p>

                  <h3 className="mt-1 text-2xl font-extrabold text-[#111111]">
                    One word
                  </h3>
                </div>

                <span className="rounded-full bg-[#DFF5E8] px-3 py-1 text-xs font-bold">
                  01
                </span>
              </div>


              <div className="mt-8 rounded-3xl bg-[#E5F2FF] p-7">

                <p className="text-sm text-slate-500">
                  Your word
                </p>

                <h3 className="mt-2 text-4xl font-extrabold text-[#111111]">
                  actually
                </h3>

                <p className="mt-3 text-sm text-slate-500">
                  Learn how to use it naturally.
                </p>

              </div>


              <div className="mt-5 rounded-2xl bg-[#F5F6F7] p-5">

                <p className="text-xs font-bold tracking-widest text-slate-400">
                  PRACTICE
                </p>

                <p className="mt-2 font-semibold text-[#111111]">
                  I actually like this place.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Now make your own sentence.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ForStudents;