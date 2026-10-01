import React from "react";
function RealLife() {
  return (
    <section id="real-life" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-bold tracking-[0.2em] text-[#65B891]">
            REAL-LIFE ENGLISH
          </p>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#111111] sm:text-5xl">
            Learn English for the moments
            <span className="block">that actually happen.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Because knowing a word is different from knowing when
            and how to use it.
          </p>

        </div>


        {/* Situations */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">

          {/* Situation 1 */}
          <div className="rounded-[2rem] border border-slate-200 p-7">

            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#E5F2FF] px-3 py-1 text-xs font-bold">
                FRIEND
              </span>

              <span className="text-2xl">01</span>
            </div>

            <div className="mt-10">

              <p className="text-sm text-slate-400">
                Your friend asks:
              </p>

              <p className="mt-2 text-xl font-bold text-[#111111]">
                "Are you coming?"
              </p>

              <div className="my-5 h-px bg-slate-100" />

              <p className="text-sm text-slate-400">
                You can say:
              </p>

              <p className="mt-2 font-bold text-[#111111]">
                "Actually, I'm busy today."
              </p>

            </div>

          </div>


          {/* Situation 2 */}
          <div className="rounded-[2rem] border border-slate-200 bg-[#F5F6F7] p-7">

            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#DFF5E8] px-3 py-1 text-xs font-bold">
                CLASS
              </span>

              <span className="text-2xl">02</span>
            </div>

            <div className="mt-10">

              <p className="text-sm text-slate-400">
                Your teacher asks:
              </p>

              <p className="mt-2 text-xl font-bold text-[#111111]">
                "Will you finish it?"
              </p>

              <div className="my-5 h-px bg-white" />

              <p className="text-sm text-slate-400">
                You can say:
              </p>

              <p className="mt-2 font-bold text-[#111111]">
                "I should finish it today."
              </p>

            </div>

          </div>


          {/* Situation 3 */}
          <div className="rounded-[2rem] border border-slate-200 p-7">

            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#E5F2FF] px-3 py-1 text-xs font-bold">
                EVERYDAY
              </span>

              <span className="text-2xl">03</span>
            </div>

            <div className="mt-10">

              <p className="text-sm text-slate-400">
                Your friend says:
              </p>

              <p className="mt-2 text-xl font-bold text-[#111111]">
                "Maybe we should go."
              </p>

              <div className="my-5 h-px bg-slate-100" />

              <p className="text-sm text-slate-400">
                You can say:
              </p>

              <p className="mt-2 font-bold text-[#111111]">
                "That sounds good."
              </p>

            </div>

          </div>

        </div>


        {/* Bottom statement */}
        <div className="mx-auto mt-14 max-w-4xl text-center">

          <p className="text-2xl font-bold text-[#111111] sm:text-3xl">
            Don't memorize sentences.
          </p>

          <p className="mt-2 text-2xl font-bold text-[#65B891] sm:text-3xl">
            Understand how to use them.
          </p>

        </div>

      </div>
    </section>
  );
}

export default RealLife;