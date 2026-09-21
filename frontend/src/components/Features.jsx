import React from "react";
function Features() {
  const features = [
    {
      number: "01",
      title: "Word Mastery",
      description:
        "Don't just learn a word. Practice it until you can use it naturally.",
      example: "learn → understand → practice → use",
    },
    {
      number: "02",
      title: "Smart Revision",
      description:
        "Revisit words you've learned before so they stay fresh in your memory.",
      example: "Remember what you already learned",
    },
    {
      number: "03",
      title: "Common Mistakes",
      description:
        "See the mistakes you make often and learn how to avoid them.",
      example: "I am agree ❌ → I agree ✓",
    },
    {
      number: "04",
      title: "Weakness Map",
      description:
        "Understand where you need more practice and focus your learning there.",
      example: "Vocabulary • Grammar • Usage",
    },
    {
      number: "05",
      title: "Challenges",
      description:
        "Turn practice into small challenges that keep learning interesting.",
      example: "Can you use this word correctly?",
    },
    {
      number: "06",
      title: "Learn Your Word",
      description:
        "Have a word in mind? Enter it and discover its uses through simple examples.",
      example: "Your word → Uses → Examples",
    },
  ];

  return (
    <section id="features" className="bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-4 text-sm font-bold tracking-[0.2em] text-blue-600">
            FEATURES
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Everything you need to{" "}
            <span className="text-blue-600">actually improve.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Speakly helps you learn, practice, remember, and understand
            where you need to improve.
          </p>

        </div>


        {/* Feature grid */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => (
            <div
              key={feature.number}
              className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >

              {/* Number */}
              <div className="flex items-center justify-between">

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                  {feature.number}
                </span>

                <span className="text-slate-300 transition group-hover:text-blue-500">
                  →
                </span>

              </div>


              {/* Content */}
              <h3 className="mt-7 text-2xl font-bold text-slate-950">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {feature.description}
              </p>


              {/* Example */}
              <div className="mt-7 rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-700">
                  {feature.example}
                </p>
              </div>

            </div>
          ))}

        </div>


        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl bg-slate-950 px-8 py-10 sm:flex-row sm:px-12">

          <div>
            <h3 className="text-2xl font-bold text-white">
              Your learning should adapt to you.
            </h3>

            <p className="mt-2 text-slate-400">
              Learn what you need. Practice what you struggle with.
            </p>
          </div>

          <button className="shrink-0 rounded-xl bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-blue-50">
            Start Learning →
          </button>

        </div>

      </div>
    </section>
  );
}

export default Features;