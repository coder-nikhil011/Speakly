import React from "react";
function WhatYouLearn() {
  return (
    <section id="learn" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-bold tracking-[0.2em] text-blue-600">
            WHAT YOU'LL LEARN
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Learn the English you{" "}
            <span className="text-blue-600">actually need.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Speakly focuses on the things that help you communicate
            naturally — without drowning you in complicated grammar rules.
          </p>
        </div>


        {/* Learning cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* Words */}
          <div className="rounded-3xl border border-slate-200 p-8 transition hover:-translate-y-1 hover:shadow-xl">

            <span className="text-sm font-bold text-blue-600">
              01
            </span>

            <h3 className="mt-5 text-2xl font-bold text-slate-950">
              Useful Words
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Learn words that appear often in everyday conversations
              and understand how people actually use them.
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-400">
                Word
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                actually
              </p>

              <p className="mt-2 text-sm text-slate-500">
                I actually like it.
              </p>
            </div>

          </div>


          {/* Grammar */}
          <div className="rounded-3xl border border-slate-200 p-8 transition hover:-translate-y-1 hover:shadow-xl">

            <span className="text-sm font-bold text-blue-600">
              02
            </span>

            <h3 className="mt-5 text-2xl font-bold text-slate-950">
              Simple Grammar
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Understand just enough grammar to build sentences
              without getting lost in complicated rules.
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-400">
                Example
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                I am working.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Present + action happening now
              </p>
            </div>

          </div>


          {/* Modal verbs */}
          <div className="rounded-3xl border border-slate-200 p-8 transition hover:-translate-y-1 hover:shadow-xl">

            <span className="text-sm font-bold text-blue-600">
              03
            </span>

            <h3 className="mt-5 text-2xl font-bold text-slate-950">
              Everyday Expressions
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Learn useful words and expressions such as
              will, would, should, may, must and more.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "will",
                "would",
                "should",
                "may",
                "must",
                "have to",
              ].map((word) => (
                <span
                  key={word}
                  className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  {word}
                </span>
              ))}
            </div>

          </div>

        </div>


        {/* Grammar philosophy */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-slate-950">

          <div className="grid lg:grid-cols-2">

            <div className="p-8 sm:p-12">

              <p className="text-sm font-bold tracking-[0.2em] text-blue-400">
                NO GRAMMAR OVERLOAD
              </p>

              <h3 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
                Grammar should help you speak,
                not stop you from speaking.
              </h3>

              <p className="mt-5 leading-7 text-slate-400">
                Learn the practical reason behind a structure and
                use it in a sentence. No need to memorize pages of
                complicated rules.
              </p>

            </div>


            <div className="flex items-center bg-slate-900 p-8 sm:p-12">

              <div className="w-full space-y-4">

                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm text-slate-400">
                    Confidence
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    I must finish this today.
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    “must” → strong certainty / necessity
                  </p>
                </div>


                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm text-slate-400">
                    Possibility
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    It may rain today.
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    “may” → possibility
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default WhatYouLearn;