import React from "react";
function WhySpeakly() {
  return (
    <section className="bg-white px-6 py-24" id="why">

      <div className="mx-auto max-w-7xl">

        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#65B891]">
            WHY SPEAKLY?
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-[#111111] sm:text-5xl">
            Learn less.{" "}
            <span className="text-[#111111]">Use more.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            You don't need to learn hundreds of words at once.
            Speakly helps you focus on a few useful words and practice
            them until you can actually use them in real life.
          </p>

        </div>


        <div className="mt-16 grid gap-6 md:grid-cols-3">

          {[
            {
              number: "01",
              title: "Focus on useful words",
              text: "Learn one or two words that you can actually use in everyday conversations.",
            },
            {
              number: "02",
              title: "See them in real sentences",
              text: "Understand how a word fits into simple, natural sentences without getting lost in difficult English.",
            },
            {
              number: "03",
              title: "Practice until it feels natural",
              text: "Create your own sentences, get feedback, and keep practicing until you feel confident.",
            },
          ].map((item) => (
            <div
              key={item.number}
              className="rounded-3xl border border-slate-200 bg-[#F5F6F7] p-8 transition hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5F2FF] text-xl font-bold text-[#111111]">
                {item.number}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#111111]">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {item.text}
              </p>

            </div>
          ))}

        </div>


        <div className="mt-14 rounded-3xl bg-[#111111] px-8 py-12 text-center">

          <p className="text-2xl font-bold text-white sm:text-3xl">
            The goal isn't to know more English.
          </p>

          <p className="mt-3 text-2xl font-bold text-[#DFF5E8] sm:text-3xl">
            It's to use the English you know.
          </p>

        </div>

      </div>

    </section>
  );
}

export default WhySpeakly;