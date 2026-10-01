import React from "react";
function HowItWorks() {
  return (
    <section id="how" className="bg-[#F5F6F7] px-6 py-24">

      <div className="mx-auto max-w-7xl">

        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#65B891]">
            HOW SPEAKLY WORKS
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-[#111111] sm:text-5xl">
            One small step at a time.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Instead of giving you too much to remember, Speakly helps
            you master a few useful words and turn them into words
            you can actually use.
          </p>

        </div>


        <div className="relative mt-16">

          <div className="absolute left-1/2 top-12 hidden h-px w-[75%] -translate-x-1/2 bg-slate-200 lg:block" />

          <div className="relative grid gap-10 lg:grid-cols-4">

            {[
              ["01", "Choose a word", "Start with one or two useful words that you are likely to use in everyday life."],
              ["02", "See simple examples", "Learn how the word is used in natural sentences with simple English and helpful Hindi hints."],
              ["03", "Give your feedback", "If an example feels difficult, Speakly can make it simpler until it feels comfortable."],
              ["04", "Make it yours", "Create your own sentence and practice using the word until it becomes natural."],
            ].map(([number, title, description], index) => (
              <div key={number} className="text-center">

                <div
                  className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border-8 border-white text-2xl font-extrabold text-[#111111] shadow-lg ${
                    index % 2 === 0
                      ? "bg-[#E5F2FF]"
                      : "bg-[#DFF5E8]"
                  }`}
                >
                  {number}
                </div>

                <h3 className="mt-7 text-xl font-bold text-[#111111]">
                  {title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {description}
                </p>

              </div>
            ))}

          </div>
        </div>


        <div className="mx-auto mt-20 max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">

          <div className="grid gap-10 md:grid-cols-2 md:items-center">

            <div>

              <p className="text-sm font-bold tracking-widest text-[#65B891]">
                EXAMPLE
              </p>

              <h3 className="mt-3 text-4xl font-extrabold text-[#111111]">
                actually
              </h3>

              <p className="mt-3 text-slate-500">
                Used when you want to correct or add information.
              </p>

            </div>


            <div className="space-y-4">

              <div className="rounded-2xl rounded-tl-md bg-[#F5F6F7] p-4 text-slate-700">

                <p className="text-xs font-semibold text-slate-400">
                  EXAMPLE
                </p>

                <p className="mt-1 font-medium">
                  I actually like this place.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  मुझे सच में यह जगह पसंद है।
                </p>

              </div>


              <div className="rounded-2xl rounded-tr-md bg-[#E5F2FF] p-4 text-[#111111]">

                <p className="text-xs font-semibold text-slate-500">
                  YOUR TURN
                </p>

                <p className="mt-1 font-medium">
                  Now make your own sentence with{" "}
                  <span className="font-bold">actually</span>.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;